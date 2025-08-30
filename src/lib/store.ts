import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Endpoint {
  id: string
  projectId?: string  // ✅ Agregado
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
  openCreateEndpointModal: () => void
  openEditEndpointModal: (endpoint: Endpoint) => void
  closeEndpointModal: () => void  // ✅ Agregar esta línea
}

const transformApiEndpointToStore = (apiEndpoint: any): Endpoint => {
  // Si ya viene transformado del GET (tiene frontendSpec/backendSpec directamente)
  if (apiEndpoint.frontendSpec !== undefined || apiEndpoint.backendSpec !== undefined) {
    return {
      id: apiEndpoint.id,
      projectId: apiEndpoint.projectId,
      path: apiEndpoint.path,
      method: apiEndpoint.method,
      name: apiEndpoint.name,
      description: apiEndpoint.description,
      status: apiEndpoint.status,
      frontendSpec: apiEndpoint.frontendSpec,
      backendSpec: apiEndpoint.backendSpec,
      conflicts: apiEndpoint.conflicts || []
    }
  }

  // Si viene sin transformar del POST (tiene specs array)
  const frontendSpec = apiEndpoint.specs?.find((spec: any) => spec.specType === 'frontend')
  const backendSpec = apiEndpoint.specs?.find((spec: any) => spec.specType === 'backend')

  return {
    id: apiEndpoint.id,
    projectId: apiEndpoint.projectId,
    path: apiEndpoint.path,
    method: apiEndpoint.method,
    name: apiEndpoint.name,
    description: apiEndpoint.description,
    status: apiEndpoint.status,
    frontendSpec: frontendSpec ? {
      id: frontendSpec.id,
      requestBody: frontendSpec.requestBody,
      responseBody: frontendSpec.responseBody,
      parameters: frontendSpec.parameters || [],
      headers: frontendSpec.headers || [],
      statusCodes: frontendSpec.statusCodes || [],
      contentType: frontendSpec.contentType,
      authentication: frontendSpec.authentication,
      rateLimit: frontendSpec.rateLimit,
      notes: frontendSpec.notes,
    } : undefined,
    backendSpec: backendSpec ? {
      id: backendSpec.id,
      requestBody: backendSpec.requestBody,
      responseBody: backendSpec.responseBody,
      parameters: backendSpec.parameters || [],
      headers: backendSpec.headers || [],
      statusCodes: backendSpec.statusCodes || [],
      contentType: backendSpec.contentType,
      authentication: backendSpec.authentication,
      rateLimit: backendSpec.rateLimit,
      notes: backendSpec.notes,
    } : undefined,
    conflicts: apiEndpoint.conflicts || []
  }
}

const transformStoreEndpointToApi = (storeEndpoint: Omit<Endpoint, 'id'>) => {
  return {
    projectId: storeEndpoint.projectId,
    path: storeEndpoint.path,
    method: storeEndpoint.method,
    name: storeEndpoint.name,
    description: storeEndpoint.description,
    status: storeEndpoint.status,
    frontendSpec: storeEndpoint.frontendSpec,
    backendSpec: storeEndpoint.backendSpec
  }
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

        // ✅ Acciones de sincronización con la API actualizadas
        fetchEndpoints: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await fetch('/api/endpoints')
            if (!response.ok) {
              throw new Error('Failed to fetch endpoints')
            }
            const apiEndpoints = await response.json()

            // Los datos del GET ya vienen transformados, pero usamos la función por consistencia
            const transformedEndpoints = apiEndpoints.map(transformApiEndpointToStore)

            set({ endpoints: transformedEndpoints, isLoading: false })
            console.log('Endpoints cargados:', transformedEndpoints.length)
          } catch (error) {
            console.error('Error fetching endpoints:', error)
            set({
              error: error instanceof Error ? error.message : 'Unknown error',
              isLoading: false
            })
          }
        },

        // En tu store, reemplaza las funciones actuales por estas:
        openCreateEndpointModal: () => {
          console.log('🚀 Abriendo modal de crear endpoint')
          set({
            selectedEndpoint: null,        // ✅ Limpiar endpoint seleccionado
            isEndpointModalOpen: true
          })
        },

        openEditEndpointModal: (endpoint: Endpoint) => {
          console.log('✏️ Abriendo modal de editar endpoint:', endpoint.id)
          set({
            selectedEndpoint: endpoint,    // ✅ Establecer endpoint a editar
            isEndpointModalOpen: true
          })
        },

        // Agregar función para cerrar el modal
        closeEndpointModal: () => {
          console.log('❌ Cerrando modal de endpoint')
          set({
            selectedEndpoint: null,
            isEndpointModalOpen: false
          })
        },

        // En tu store
        createEndpoint: async (endpointData) => {
          try {
            console.log('Creando endpoint con datos:', endpointData);

            const response = await fetch('/api/endpoints', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(endpointData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Error al crear endpoint');
            }

            const newEndpoint = await response.json();
            console.log('Endpoint creado:', newEndpoint);

            // Actualizar el estado local
            set(state => ({
              endpoints: [...state.endpoints, newEndpoint]
            }));

            return newEndpoint;
          } catch (error) {
            console.error('Error en createEndpoint:', error);
            throw error;
          }
        },


        updateEndpointInDB: async (id, updates) => {
          set({ isLoading: true, error: null })
          try {
            // Transformar las actualizaciones al formato de la API
            const apiUpdates = transformStoreEndpointToApi(updates as Omit<Endpoint, 'id'>)

            const response = await fetch(`/api/endpoints/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(apiUpdates),
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error || 'Failed to update endpoint')
            }

            const updatedEndpoint = await response.json()

            // Transformar la respuesta de la API al formato del store
            const transformedEndpoint = transformApiEndpointToStore(updatedEndpoint)

            set((state) => ({
              endpoints: state.endpoints.map(endpoint =>
                endpoint.id === id ? transformedEndpoint : endpoint
              ),
              isLoading: false
            }))
          } catch (error) {
            console.error('Error updating endpoint:', error)
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
  )
)
