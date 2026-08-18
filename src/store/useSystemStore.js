import { create } from 'zustand'
import { mockSystem } from '../lib/mockData.js'
import { getActuatorHealth, getActuatorInfo } from '../lib/api.js'

const useSystemStore = create((set, get) => ({
  status: { ...mockSystem },
  health: { status: 'UP' },
  info:   { app: { name: 'SkyLink', version: '1.0.0' } },
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const [healthRes, infoRes] = await Promise.all([
        getActuatorHealth(),
        getActuatorInfo(),
      ])

      const cpu = Math.round(mockSystem.cpu + (Math.random() - 0.5) * 8)
      const temp = Math.round(mockSystem.temp + (Math.random() - 0.5) * 2)

      set({
        status: {
          ...mockSystem,
          cpu: Math.max(5, Math.min(95, cpu)),
          temp: Math.max(40, Math.min(75, temp)),
          uptimeSeconds: (get().status.uptimeSeconds || mockSystem.uptimeSeconds) + 15,
        },
        health: healthRes,
        info: infoRes,
        loading: false,
      })
    } catch (err) {
      console.warn('System fetch error:', err)
      set({ loading: false })
    }
  },
}))

export default useSystemStore
