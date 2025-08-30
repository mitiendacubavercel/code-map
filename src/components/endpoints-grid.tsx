'use client'

import React, { useEffect, useState } from 'react'
import { EndpointCard } from './endpoint-card'
import { Endpoint } from '@/lib/store'
import { useAppStore } from '@/lib/store'

interface EndpointsGridProps {
  endpoints: Endpoint[]
  onEndpointClick?: (endpoint: Endpoint) => void
  onEndpointEdit?: (endpoint: Endpoint) => void
  className?: string
}

export function EndpointsGrid({
  endpoints,
  onEndpointClick,
  onEndpointEdit,
  className
}: EndpointsGridProps) {
  const [isClient, setIsClient] = useState(false)

  // ✅ CAMBIAR ESTA LÍNEA - usar las nuevas funciones
  const {
    setSelectedEndpoint,
    openCreateEndpointModal,  // ✅ Nueva función
    openEditEndpointModal     // ✅ Nueva función
  } = useAppStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEndpointClick = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint)
    onEndpointClick?.(endpoint)
  }

  const handleEndpointEdit = (endpoint: Endpoint) => {
    // ✅ CAMBIAR ESTA LÍNEA - usar la nueva función
    openEditEndpointModal(endpoint)
    onEndpointEdit?.(endpoint)
  }

  // Mostrar loading durante la hidratación
  if (!isClient) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cargando endpoints...
          </h3>
          <p className="text-gray-500">
            Por favor espera mientras cargamos los datos.
          </p>
        </div>
      </div>
    )
  }

  // Estado vacío - solo se muestra después de la hidratación
  if (endpoints.length === 0) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay endpoints definidos
          </h3>
          <p className="text-gray-500 mb-4">
            Comienza creando tu primer endpoint para sincronizar las especificaciones.
          </p>
          <button
            onClick={() => {
              console.log('🔍 Estado antes de crear:', {
                selectedEndpoint: useAppStore.getState().selectedEndpoint?.id,
                isModalOpen: useAppStore.getState().isEndpointModalOpen
              })

              openCreateEndpointModal()

              // Verificar después de un tick
              setTimeout(() => {
                console.log('🔍 Estado después de crear:', {
                  selectedEndpoint: useAppStore.getState().selectedEndpoint,
                  isModalOpen: useAppStore.getState().isEndpointModalOpen
                })
              }, 0)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Crear Endpoint
          </button>
        </div>
      </div>
    )
  }

  // Grilla con endpoints - solo se muestra después de la hidratación
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            onClick={() => handleEndpointClick(endpoint)}
            onEdit={() => handleEndpointEdit(endpoint)}
          />
        ))}
      </div>
    </div>
  )
}
