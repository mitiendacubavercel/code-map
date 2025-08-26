'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye, AlertTriangle, CheckCircle, Clock, HelpCircle } from 'lucide-react'
import { Endpoint } from '@/lib/store'
import { cn } from '@/lib/utils'

interface EndpointCardProps {
  endpoint: Endpoint
  onClick?: () => void
  onEdit?: () => void
  className?: string
}

const getStatusIcon = (status: Endpoint['status']) => {
  switch (status) {
    case 'SYNCED':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'CONFLICT':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'UNDEFINED':
      return <HelpCircle className="h-4 w-4 text-gray-500" />
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: Endpoint['status']) => {
  switch (status) {
    case 'SYNCED':
      return 'bg-green-100 border-green-200 hover:bg-green-50'
    case 'CONFLICT':
      return 'bg-red-100 border-red-200 hover:bg-red-50'
    case 'PENDING':
      return 'bg-yellow-100 border-yellow-200 hover:bg-yellow-50'
    case 'UNDEFINED':
      return 'bg-gray-100 border-gray-200 hover:bg-gray-50'
    default:
      return 'bg-gray-100 border-gray-200 hover:bg-gray-50'
  }
}

const getMethodColor = (method: Endpoint['method']) => {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'POST':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'PUT':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'PATCH':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'DELETE':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function EndpointCard({ endpoint, onClick, onEdit, className }: EndpointCardProps) {
  const conflictsCount = endpoint.conflicts?.length || 0

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        getStatusColor(endpoint.status),
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(endpoint.status)}
            <CardTitle className="text-lg font-semibold">
              {endpoint.name || endpoint.path}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn('font-mono text-xs', getMethodColor(endpoint.method))}
            >
              {endpoint.method}
            </Badge>
            {conflictsCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {conflictsCount} conflicto{conflictsCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-mono text-muted-foreground">
              {endpoint.path}
            </p>
            {endpoint.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {endpoint.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Frontend:</span>
                <Badge variant={endpoint.frontendSpec ? 'success' : 'secondary'} className="text-xs">
                  {endpoint.frontendSpec ? 'Definido' : 'Pendiente'}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span>Backend:</span>
                <Badge variant={endpoint.backendSpec ? 'success' : 'secondary'} className="text-xs">
                  {endpoint.backendSpec ? 'Definido' : 'Pendiente'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClick?.()
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
