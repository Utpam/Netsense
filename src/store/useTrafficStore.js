import { create } from 'zustand'
import { mockTrafficLive, mockTrafficHistory, mockDailyUsage, mockMonthlyUsage, mockTopTalkers } from '../lib/mockData.js'
import { clamp } from '../lib/utils.js'

const useTrafficStore = create((set, get) => ({
  live:    { ...mockTrafficLive },
  history: [...mockTrafficHistory],
  daily:   mockDailyUsage,
  monthly: mockMonthlyUsage,
  top:     mockTopTalkers,

  tick: () => {
    const rxRate = clamp(get().live.rxRate * (0.7 + Math.random() * 0.7), 50_000, 12_000_000)
    const txRate = clamp(get().live.txRate * (0.7 + Math.random() * 0.7), 10_000, 4_000_000)

    const newPoint = {
      t:  get().history.length,
      rx: +(rxRate / 1_048_576).toFixed(2),
      tx: +(txRate / 1_048_576).toFixed(2),
    }

    set({
      live: { ...get().live, rxRate, txRate },
      history: [...get().history.slice(-59), newPoint],
    })
  },
}))

export default useTrafficStore
