'use client'

import React from 'react'
import { EndpointsGrid } from '@/components/endpoints-grid'
import { FiltersBar } from '@/components/filters-bar'
import { EndpointModal } from '@/components/endpoint-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Settings, Users, Activity, BarChart3 } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function HomePage() {
  const {
    endpoints,
    getFilteredEndpoints,
    isEndpointModalOpen,
    setEndpointModalOpen,
    getConflictsCount,
    getSyncedCount,
  } = useAppStore()

  const filteredEndpoints = getFilteredEndpoints()
  const conflictsCount = getConflictsCount()
  const syncedCount = getSyncedCount()
  const totalEndpoints = endpoints.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                API Sync Hub
              </h1>
              <Badge variant="outline" className="ml-3">
                Beta
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Actividad
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Colaboradores
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Endpoints </p>
                <p className="text-2xl font-semibold text-gray-900">{totalEndpoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="h-6 w-6 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sincronizados</p>
                <p className="text-2xl font-semibold text-gray-900">{syncedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="h-6 w-6 bg-red-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conflictos</p>
                <p className="text-2xl font-semibold text-gray-900">{conflictsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="h-6 w-6 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalEndpoints - syncedCount - conflictsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Endpoints del Proyecto
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona y sincroniza las especificaciones entre frontend y backend
            </p>
          </div>
          
          <Button onClick={() => setEndpointModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Endpoint
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <FiltersBar />
        </div>

        {/* Endpoints Grid */}
        <div className="bg-white rounded-lg shadow">
          <EndpointsGrid 
            endpoints={filteredEndpoints}
            className="p-6"
          />
        </div>
      </main>

      {/* Modals */}
      <EndpointModal 
        open={isEndpointModalOpen}
        onOpenChange={setEndpointModalOpen}
      />
    </div>
  )
}
