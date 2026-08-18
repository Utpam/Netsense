import { useEffect, useRef } from 'react'

/**
 * usePolling — runs `callback` every `intervalMs`, starting immediately.
 * Stops when the component unmounts or `enabled` is false.
 */
export function usePolling(callback, intervalMs, enabled = true) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return
    savedCallback.current()                            // immediate first call
    const id = setInterval(() => savedCallback.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, enabled])
}
