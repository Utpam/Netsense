import { create } from 'zustand'
import { mockFileShares, mockFileBrowse } from '../lib/mockData.js'

const initialRecentFiles = [
  { name: 'network-backup-2026-09-01.tar.gz', size: 14_857_600, modified: '2026-09-01', folder: 'backup' },
  { name: 'farm_telemetry_dataset_aug.csv', size: 8_388_608, modified: '2026-08-30', folder: 'documents' },
  { name: 'site_survey_map.pdf', size: 3_145_728, modified: '2026-08-25', folder: 'documents' },
]

const useFilesStore = create((set, get) => ({
  shares: mockFileShares.map(s => ({ ...s })),
  files: [...mockFileBrowse],
  recentFiles: initialRecentFiles,
  currentFolder: 'media',
  currentPath: '/media',
  loading: false,

  uploadFile: (fileObj) => {
    const newFile = {
      name: fileObj.name || 'uploaded_file.bin',
      isDir: false,
      size: fileObj.size || 1024 * 1024,
      modified: new Date().toISOString().split('T')[0]
    }
    const currentFiles = get().files
    set({
      files: [newFile, ...currentFiles],
      recentFiles: [{ ...newFile, folder: get().currentFolder }, ...get().recentFiles.slice(0, 4)]
    })
  },

  deleteFile: (fileName) => {
    set({
      files: get().files.filter(f => f.name !== fileName),
      recentFiles: get().recentFiles.filter(f => f.name !== fileName)
    })
  },

  setFolder: (folderName) => {
    set({
      currentFolder: folderName,
      currentPath: `/${folderName}`
    })
  },

  addShare: (share) => {
    set({ shares: [...get().shares, { ...share, files: 0 }] })
  },

  removeShare: (name) => {
    set({ shares: get().shares.filter(s => s.name !== name) })
  },

  updateShare: (name, updates) => {
    set({ shares: get().shares.map(s => s.name === name ? { ...s, ...updates } : s) })
  },
}))

export default useFilesStore
