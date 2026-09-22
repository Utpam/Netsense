import { create } from 'zustand'
import { mockDevices } from '../lib/mockData.js'

const useDeviceStore = create((set, get) => ({
  devices: mockDevices.map(d => ({ ...d })),
  loading: false,

  fetch: async () => {
    set({ loading: false })
  },

  // Toggle blocked state (pause/resume internet)
  toggleBlock: (mac) => {
    set({
      devices: get().devices.map(d =>
        d.mac === mac ? { ...d, blocked: !d.blocked } : d
      ),
    })
  },

  // Patch any device fields by MAC
  updateDevice: (mac, patch) => {
    set({
      devices: get().devices.map(d =>
        d.mac === mac ? { ...d, ...patch } : d
      ),
    })
  },

  // Legacy specific methods
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
