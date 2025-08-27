import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Endpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  name?: string
  description?: string
  status: 'SYNCED' | 'CONFLICT' | 'PENDING' | 'UNDEFINED'
  frontendSpec?: EndpointSpec
  backendSpec?: EndpointSpec
  conflicts?: Conflict[]
}

export interface EndpointSpec {
  id: string
  requestBody?: unknown
  responseBody?: unknown
  parameters: Parameter[]
  headers: Header[]
  statusCodes: StatusCode[]
  contentType?: string
  authentication?: string
  rateLimit?: string
  notes?: string
}

export interface Parameter {
  id: string
  name: string
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'OBJECT' | 'FILE'
  required: boolean
  description?: string
  defaultValue?: string
  validation?: unknown
}

export interface Header {
  id: string
  name: string
  value?: string
  required: boolean
  description?: string
}

export interface StatusCode {
  id: string
  code: number
  description?: string
  responseBody?: unknown
}

export interface Conflict {
  id: string
  type: 'METHOD_MISMATCH' | 'PARAMETER_MISMATCH' | 'RESPONSE_MISMATCH' | 'HEADER_MISMATCH' | 'STATUS_CODE_MISMATCH' | 'AUTHENTICATION_MISMATCH'
  field: string
  frontendValue?: string
  backendValue?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  resolved: boolean
}

export interface Project {
  id: string
  name: string
  description?: string
  isPublic: boolean
  endpoints: Endpoint[]
}

interface AppState {
  // Estado actual
  currentProject: Project | null
  selectedEndpoint: Endpoint | null
  endpoints: Endpoint[]
  
  // Filtros y vista
  statusFilter: string[]
  methodFilter: string[]
  searchQuery: string
  
  // UI State
  isSidebarOpen: boolean
  isEndpointModalOpen: boolean
  isConflictModalOpen: boolean
  
  // Acciones
  setCurrentProject: (project: Project | null) => void
  setSelectedEndpoint: (endpoint: Endpoint | null) => void
  setEndpoints: (endpoints: Endpoint[]) => void
  addEndpoint: (endpoint: Endpoint) => void
  updateEndpoint: (id: string, updates: Partial<Endpoint>) => void
  deleteEndpoint: (id: string) => void
  
  setStatusFilter: (filters: string[]) => void
  setMethodFilter: (filters: string[]) => void
  setSearchQuery: (query: string) => void
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setEndpointModalOpen: (open: boolean) => void
  setConflictModalOpen: (open: boolean) => void
  
  // Utilidades
  getFilteredEndpoints: () => Endpoint[]
  getEndpointById: (id: string) => Endpoint | undefined
  getConflictsCount: () => number
  getSyncedCount: () => number
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      currentProject: null,
      selectedEndpoint: null,
      endpoints: [],
      statusFilter: [],
      methodFilter: [],
      searchQuery: '',
      isSidebarOpen: true,
      isEndpointModalOpen: false,
      isConflictModalOpen: false,
      
      // Acciones
      setCurrentProject: (project) => set({ currentProject: project }),
      setSelectedEndpoint: (endpoint) => set({ selectedEndpoint: endpoint }),
      setEndpoints: (endpoints) => set({ endpoints }),
      
      addEndpoint: (endpoint) => 
        set((state) => ({ 
          endpoints: [...state.endpoints, endpoint] 
        })),
      
      updateEndpoint: (id, updates) =>
        set((state) => ({
          endpoints: state.endpoints.map(endpoint =>
            endpoint.id === id ? { ...endpoint, ...updates } : endpoint
          )
        })),
      
      deleteEndpoint: (id) =>
        set((state) => ({
          endpoints: state.endpoints.filter(endpoint => endpoint.id !== id)
        })),
      
      setStatusFilter: (filters) => set({ statusFilter: filters }),
      setMethodFilter: (filters) => set({ methodFilter: filters }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setEndpointModalOpen: (open) => set({ isEndpointModalOpen: open }),
      setConflictModalOpen: (open) => set({ isConflictModalOpen: open }),
      
      // Utilidades
      getFilteredEndpoints: () => {
        const { endpoints, statusFilter, methodFilter, searchQuery } = get()
        
        return endpoints.filter(endpoint => {
          const matchesStatus = statusFilter.length === 0 || statusFilter.includes(endpoint.status)
          const matchesMethod = methodFilter.length === 0 || methodFilter.includes(endpoint.method)
          const matchesSearch = !searchQuery || 
            endpoint.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase())
          
          return matchesStatus && matchesMethod && matchesSearch
        })
      },
      
      getEndpointById: (id) => {
        const { endpoints } = get()
        return endpoints.find(endpoint => endpoint.id === id)
      },
      
      getConflictsCount: () => {
        const { endpoints } = get()
        return endpoints.filter(endpoint => endpoint.status === 'CONFLICT').length
      },
      
      getSyncedCount: () => {
        const { endpoints } = get()
        return endpoints.filter(endpoint => endpoint.status === 'SYNCED').length
      },
    }),
    {
      name: 'api-sync-store',
    }
  )
)
