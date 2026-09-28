import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getHotspotStatus,
  getConnectedDevices,
} from '../services/hotspotApi.js'

// Polling interval in milliseconds (5–10s default; easily adjustable)
export const HOTSPOT_REFRESH_INTERVAL = 10000

/**
 * useHotspot hook
 * Manages fetching, auto-polling, manual refresh, loading, error, and device list states.
 *
 * Exposes:
 * - status: { active: boolean, connectedDeviceCount: number } | null
 * - devices: Array<{ deviceName, ipAddress, macAddress, ... }>
 * - loading: boolean (initial loading)
 * - isRefreshing: boolean (refreshing in flight)
 * - statusError: string | null
 * - devicesError: string | null
 * - error: string | null
 * - lastUpdated: Date | null
 * - refresh: () => Promise<void>
 * - toggleBlockDevice: (mac: string) => void
 * - updateDeviceName: (mac: string, name: string) => void
 */
export function useHotspot(options = {}) {
  const {
    interval = HOTSPOT_REFRESH_INTERVAL,
    autoPoll = true,
  } = options

  const [status, setStatus] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusError, setStatusError] = useState(null)
  const [devicesError, setDevicesError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Track local modifications (e.g. paused/blocked state, custom friendly names)
  const [localOverrides, setLocalOverrides] = useState({})

  // Guard against simultaneous requests
  const isFetchingRef = useRef(false)
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async (isManual = false) => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    if (isManual) {
      setIsRefreshing(true)
    }

    try {
      // Concurrently fetch status and connected devices
      // Using Promise.allSettled so a failure in one doesn't break the other
      const [statusResult, devicesResult] = await Promise.allSettled([
        getHotspotStatus(),
        getConnectedDevices(),
      ])

      if (!isMountedRef.current) return

      let hasSuccess = false

      // 1. Process Status
      if (statusResult.status === 'fulfilled') {
        setStatus(statusResult.value)
        setStatusError(null)
        hasSuccess = true
      } else {
        const errMsg = statusResult.reason?.message || 'Unable to fetch hotspot status'
        setStatusError(errMsg)
      }

      // 2. Process Connected Devices
      if (devicesResult.status === 'fulfilled') {
        const fetchedDevices = devicesResult.value
        // Apply any local user overrides (such as paused/blocked state)
        const mapped = fetchedDevices.map(d => {
          const override = localOverrides[d.macAddress] || {}
          return {
            ...d,
            ...override,
            name: override.name || d.deviceName,
          }
        })
        setDevices(mapped)
        setDevicesError(null)
        hasSuccess = true
      } else {
        const errMsg = devicesResult.reason?.message || 'Unable to load connected devices'
        setDevicesError(errMsg)
      }

      if (hasSuccess) {
        setLastUpdated(new Date())
      }
    } catch (err) {
      if (!isMountedRef.current) return
      console.error('[useHotspot] Unexpected error during fetch:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
        setIsRefreshing(false)
      }
      isFetchingRef.current = false
    }
  }, [localOverrides])

  // Initial fetch and auto-polling setup
  useEffect(() => {
    isMountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()

    if (!autoPoll || interval <= 0) {
      return () => {
        isMountedRef.current = false
      }
    }

    const timerId = setInterval(() => {
      fetchData()
    }, interval)

    return () => {
      isMountedRef.current = false
      clearInterval(timerId)
    }
  }, [fetchData, autoPoll, interval])

  // Manual refresh trigger
  const refresh = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  // Local device state modifiers (for seamless integration with DeviceDetailModal)
  const toggleBlockDevice = useCallback((mac) => {
    setLocalOverrides(prev => {
      const current = prev[mac] || {}
      return {
        ...prev,
        [mac]: {
          ...current,
          blocked: !current.blocked,
        },
      }
    })
    setDevices(prev =>
      prev.map(d => (d.macAddress === mac || d.mac === mac ? { ...d, blocked: !d.blocked } : d))
    )
  }, [])

  const updateDeviceName = useCallback((mac, newName) => {
    setLocalOverrides(prev => {
      const current = prev[mac] || {}
      return {
        ...prev,
        [mac]: {
          ...current,
          name: newName,
        },
      }
    })
    setDevices(prev =>
      prev.map(d => (d.macAddress === mac || d.mac === mac ? { ...d, name: newName, deviceName: newName } : d))
    )
  }, [])

  // Aggregate general error if both endpoints failed
  const error = statusError && devicesError ? 'Hotspot API is currently unavailable.' : null

  return {
    status,
    devices,
    loading,
    isRefreshing,
    error,
    statusError,
    devicesError,
    lastUpdated,
    refresh,
    toggleBlockDevice,
    updateDeviceName,
  }
}

export default useHotspot
