import { create } from 'zustand'
import { mockVpnStatus, mockVpnPeers } from '../lib/mockData.js'

let nextPeerId = mockVpnPeers.length + 1

const useVpnStore = create((set, get) => ({
  status:  { ...mockVpnStatus },
  peers:   mockVpnPeers.map(p => ({ ...p })),
  loading: false,

  start: () => set({ status: { ...get().status, status: 'up' } }),
  stop:  () => set({ status: { ...get().status, status: 'down' } }),

  addPeer: (peer) => {
    set({ peers: [...get().peers, { ...peer, id: nextPeerId++, lastHandshake: 'never', rxBytes: 0, txBytes: 0 }] })
  },

  removePeer: (id) => {
    set({ peers: get().peers.filter(p => p.id !== id) })
  },
}))

export default useVpnStore
