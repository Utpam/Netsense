import { create } from 'zustand'
import { mockDevices } from '../lib/mockData.js'

const useDeviceStore = create((set, get) => ({
  devices: mockDevices.map(d => ({ ...d })),
  loading: false,

  fetch: async () => {
    // Simulate devices going online/offline slightly
    set({ loading: false })
  },

  setName: (mac, name) => {
    set({
      devices: get().devices.map(d => d.mac === mac ? { ...d, name } : d),
    })
  },

  block: (mac) => {
    set({
      devices: get().devices.map(d => d.mac === mac ? { ...d, blocked: true } : d),
    })
  },

  unblock: (mac) => {
    set({
      devices: get().devices.map(d => d.mac === mac ? { ...d, blocked: false } : d),
    })
  },

  remove: (mac) => {
    set({ devices: get().devices.filter(d => d.mac !== mac) })
  },
}))

export default useDeviceStore
