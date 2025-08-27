'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const STATUS_OPTIONS = [
  { value: 'SYNCED', label: 'Sincronizado', color: 'success' },
  { value: 'CONFLICT', label: 'Conflicto', color: 'error' },
  { value: 'PENDING', label: 'Pendiente', color: 'warning' },
  { value: 'UNDEFINED', label: 'No definido', color: 'secondary' },
]

export function FiltersBar() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    getFilteredEndpoints,
    getConflictsCount,
    getSyncedCount,
  } = useAppStore()

  const filteredEndpoints = getFilteredEndpoints()
  const conflictsCount = getConflictsCount()
  const syncedCount = getSyncedCount()

  const handleStatusFilterChange = (value: string) => {
    if (statusFilter.includes(value)) {
      setStatusFilter(statusFilter.filter(s => s !== value))
    } else {
      setStatusFilter([...statusFilter, value])
    }
  }

  const handleMethodFilterChange = (value: string) => {
    if (methodFilter.includes(value)) {
      setMethodFilter(methodFilter.filter(m => m !== value))
    } else {
      setMethodFilter([...methodFilter, value])
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setStatusFilter([])
    setMethodFilter([])
  }

  const hasActiveFilters = searchQuery || statusFilter.length > 0 || methodFilter.length > 0

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value="" onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value="" onValueChange={handleMethodFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por método" />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros activos */}
      {(statusFilter.length > 0 || methodFilter.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {statusFilter.map((status) => {
            const statusOption = STATUS_OPTIONS.find(s => s.value === status)
            return (
              <Badge
                key={status}
                variant={statusOption?.color as 'default' | 'secondary' | 'destructive' | 'outline'}
                className="cursor-pointer"
                onClick={() => handleStatusFilterChange(status)}
              >
                {statusOption?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )
          })}
          
          {methodFilter.map((method) => (
            <Badge
              key={method}
              variant="outline"
              className="cursor-pointer"
              onClick={() => handleMethodFilterChange(method)}
            >
              {method}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Estadísticas */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            {filteredEndpoints.length} endpoint{filteredEndpoints.length !== 1 ? 's' : ''} mostrado{filteredEndpoints.length !== 1 ? 's' : ''}
          </span>
          {conflictsCount > 0 && (
            <span className="text-red-600">
              {conflictsCount} conflicto{conflictsCount !== 1 ? 's' : ''}
            </span>
          )}
          {syncedCount > 0 && (
            <span className="text-green-600">
              {syncedCount} sincronizado{syncedCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <span className="text-gray-500">
            Filtros aplicados
          </span>
        )}
      </div>
    </div>
  )
}
