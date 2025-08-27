import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
  
  // Estado de sincronización
  isLoading: boolean
  error: string | null
  
  // Acciones
  setCurrentProject: (project: Project | null) => void
  setSelectedEndpoint: (endpoint: Endpoint | null) => void
  setEndpoints: (endpoints: Endpoint[]) => void
  addEndpoint: (endpoint: Endpoint) => void
  updateEndpoint: (id: string, updates: Partial<Endpoint>) => void
  deleteEndpoint: (id: string) => void
  
  // Acciones de sincronización con la API
  fetchEndpoints: () => Promise<void>
  createEndpoint: (endpoint: Omit<Endpoint, 'id'>) => Promise<void>
  updateEndpointInDB: (id: string, updates: Partial<Endpoint>) => Promise<void>
  deleteEndpointFromDB: (id: string) => Promise<void>
  
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
    persist(
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
        isLoading: false,
        error: null,
      
      // Acciones básicas
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
      
      // Acciones de sincronización con la API
      fetchEndpoints: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/endpoints')
          if (!response.ok) {
            throw new Error('Failed to fetch endpoints')
          }
          const endpoints = await response.json()
          set({ endpoints, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error', 
            isLoading: false 
          })
        }
      },
      
      createEndpoint: async (endpointData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/endpoints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(endpointData),
          })
          
          if (!response.ok) {
            throw new Error('Failed to create endpoint')
          }
          
          const createdEndpoint = await response.json()
          set((state) => ({
            endpoints: [...state.endpoints, createdEndpoint],
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error', 
            isLoading: false 
          })
        }
      },
      
      updateEndpointInDB: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/endpoints/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          })
          
          if (!response.ok) {
            throw new Error('Failed to update endpoint')
          }
          
          const updatedEndpoint = await response.json()
          set((state) => ({
            endpoints: state.endpoints.map(endpoint =>
              endpoint.id === id ? { ...endpoint, ...updatedEndpoint } : endpoint
            ),
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error', 
            isLoading: false 
          })
        }
      },
      
      deleteEndpointFromDB: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/endpoints/${id}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) {
            throw new Error('Failed to delete endpoint')
          }
          
          set((state) => ({
            endpoints: state.endpoints.filter(endpoint => endpoint.id !== id),
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error', 
            isLoading: false 
          })
        }
      },
      
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
))
