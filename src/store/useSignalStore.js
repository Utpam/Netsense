import { create } from 'zustand'
import { mockSignal, mockModem, mockSignalHistory } from '../lib/mockData.js'
import { clamp, generateSignalHistory } from '../lib/utils.js'

const useSignalStore = create((set, get) => ({
  current:   { ...mockSignal },
  modem:     { ...mockModem },
  history:   [...mockSignalHistory],
  loading:   false,

  fetch: async () => {
    const prev = get().current.rssi
    const rssi = Math.round(clamp(prev + (Math.random() - 0.5) * 6, -100, -55))
    const sinr = Math.round(clamp(get().current.sinr + (Math.random() - 0.5) * 2, 0, 30))

    const newPoint = { t: get().history.length, rssi }
    const history  = [...get().history.slice(-39), newPoint]

    set({
      current: { ...get().current, rssi, sinr },
      history,
    })
  },
}))

export default useSignalStore
