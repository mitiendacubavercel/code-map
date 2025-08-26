'use client'

import React from 'react'
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
  const { setSelectedEndpoint, setEndpointModalOpen } = useAppStore()

  const handleEndpointClick = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint)
    onEndpointClick?.(endpoint)
  }

  const handleEndpointEdit = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint)
    setEndpointModalOpen(true)
    onEndpointEdit?.(endpoint)
  }

  if (endpoints.length === 0) {
    return (
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
          onClick={() => setEndpointModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Crear Endpoint
        </button>
      </div>
    )
  }

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
