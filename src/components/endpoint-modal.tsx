'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { useAppStore, Endpoint, EndpointSpec, Parameter, Header, StatusCode } from '@/lib/store'

interface EndpointModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const PARAMETER_TYPES = ['STRING', 'NUMBER', 'BOOLEAN', 'ARRAY', 'OBJECT', 'FILE']

export function EndpointModal({ open, onOpenChange }: EndpointModalProps) {
  const { selectedEndpoint, addEndpoint, updateEndpoint, setEndpointModalOpen } = useAppStore()
  
  const [formData, setFormData] = useState<Partial<Endpoint>>({
    path: '',
    method: 'GET',
    name: '',
    description: '',
    frontendSpec: {
      id: '',
      parameters: [],
      headers: [],
      statusCodes: [],
    },
    backendSpec: {
      id: '',
      parameters: [],
      headers: [],
      statusCodes: [],
    },
  })

  const [activeTab, setActiveTab] = useState('frontend')

  useEffect(() => {
    if (selectedEndpoint) {
      setFormData({
        ...selectedEndpoint,
        frontendSpec: selectedEndpoint.frontendSpec || {
          id: '',
          parameters: [],
          headers: [],
          statusCodes: [],
        },
        backendSpec: selectedEndpoint.backendSpec || {
          id: '',
          parameters: [],
          headers: [],
          statusCodes: [],
        },
      })
    } else {
      setFormData({
        path: '',
        method: 'GET',
        name: '',
        description: '',
        frontendSpec: {
          id: '',
          parameters: [],
          headers: [],
          statusCodes: [],
        },
        backendSpec: {
          id: '',
          parameters: [],
          headers: [],
          statusCodes: [],
        },
      })
    }
  }, [selectedEndpoint])

  const handleSave = () => {
    const endpointData: Endpoint = {
      id: selectedEndpoint?.id || `endpoint-${Date.now()}`,
      path: formData.path || '',
      method: formData.method || 'GET',
      name: formData.name,
      description: formData.description,
      status: 'UNDEFINED', // Se calculará automáticamente
      frontendSpec: formData.frontendSpec,
      backendSpec: formData.backendSpec,
      conflicts: [],
    }

    if (selectedEndpoint) {
      updateEndpoint(selectedEndpoint.id, endpointData)
    } else {
      addEndpoint(endpointData)
    }

    setEndpointModalOpen(false)
  }

  const addParameter = (specType: 'frontendSpec' | 'backendSpec') => {
    const newParameter: Parameter = {
      id: `param-${Date.now()}`,
      name: '',
      type: 'STRING',
      required: false,
      description: '',
      defaultValue: '',
    }

    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        parameters: [...(prev[specType]?.parameters || []), newParameter],
      },
    }))
  }

  const updateParameter = (specType: 'frontendSpec' | 'backendSpec', index: number, field: keyof Parameter, value: any) => {
    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        parameters: prev[specType]?.parameters.map((param, i) =>
          i === index ? { ...param, [field]: value } : param
        ),
      },
    }))
  }

  const removeParameter = (specType: 'frontendSpec' | 'backendSpec', index: number) => {
    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        parameters: prev[specType]?.parameters.filter((_, i) => i !== index),
      },
    }))
  }

  const addHeader = (specType: 'frontendSpec' | 'backendSpec') => {
    const newHeader: Header = {
      id: `header-${Date.now()}`,
      name: '',
      value: '',
      required: false,
      description: '',
    }

    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        headers: [...(prev[specType]?.headers || []), newHeader],
      },
    }))
  }

  const updateHeader = (specType: 'frontendSpec' | 'backendSpec', index: number, field: keyof Header, value: any) => {
    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        headers: prev[specType]?.headers.map((header, i) =>
          i === index ? { ...header, [field]: value } : header
        ),
      },
    }))
  }

  const removeHeader = (specType: 'frontendSpec' | 'backendSpec', index: number) => {
    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        headers: prev[specType]?.headers.filter((_, i) => i !== index),
      },
    }))
  }

  const addStatusCode = (specType: 'frontendSpec' | 'backendSpec') => {
    const newStatusCode: StatusCode = {
      id: `status-${Date.now()}`,
      code: 200,
      description: '',
      responseBody: null,
    }

    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        statusCodes: [...(prev[specType]?.statusCodes || []), newStatusCode],
      },
    }))
  }

  const updateStatusCode = (specType: 'frontendSpec' | 'backendSpec', index: number, field: keyof StatusCode, value: any) => {
    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        statusCodes: prev[specType]?.statusCodes.map((status, i) =>
          i === index ? { ...status, [field]: value } : status
        ),
      },
    }))
  }

  const removeStatusCode = (specType: 'frontendSpec' | 'backendSpec', index: number) => {
    setFormData(prev => ({
      ...prev,
      [specType]: {
        ...prev[specType],
        statusCodes: prev[specType]?.statusCodes.filter((_, i) => i !== index),
      },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedEndpoint ? 'Editar Endpoint' : 'Crear Nuevo Endpoint'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica del endpoint */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del endpoint"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Método HTTP</label>
              <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Path</label>
              <Input
                value={formData.path || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                placeholder="/api/endpoint"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción del endpoint"
              rows={2}
            />
          </div>

          {/* Tabs para Frontend y Backend */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="frontend">Especificación Frontend</TabsTrigger>
              <TabsTrigger value="backend">Especificación Backend</TabsTrigger>
            </TabsList>

            <TabsContent value="frontend" className="space-y-4">
              <EndpointSpecForm
                spec={formData.frontendSpec}
                onUpdate={(spec) => setFormData(prev => ({ ...prev, frontendSpec: spec }))}
                addParameter={() => addParameter('frontendSpec')}
                updateParameter={(index, field, value) => updateParameter('frontendSpec', index, field, value)}
                removeParameter={(index) => removeParameter('frontendSpec', index)}
                addHeader={() => addHeader('frontendSpec')}
                updateHeader={(index, field, value) => updateHeader('frontendSpec', index, field, value)}
                removeHeader={(index) => removeHeader('frontendSpec', index)}
                addStatusCode={() => addStatusCode('frontendSpec')}
                updateStatusCode={(index, field, value) => updateStatusCode('frontendSpec', index, field, value)}
                removeStatusCode={(index) => removeStatusCode('frontendSpec', index)}
              />
            </TabsContent>

            <TabsContent value="backend" className="space-y-4">
              <EndpointSpecForm
                spec={formData.backendSpec}
                onUpdate={(spec) => setFormData(prev => ({ ...prev, backendSpec: spec }))}
                addParameter={() => addParameter('backendSpec')}
                updateParameter={(index, field, value) => updateParameter('backendSpec', index, field, value)}
                removeParameter={(index) => removeParameter('backendSpec', index)}
                addHeader={() => addHeader('backendSpec')}
                updateHeader={(index, field, value) => updateHeader('backendSpec', index, field, value)}
                removeHeader={(index) => removeHeader('backendSpec', index)}
                addStatusCode={() => addStatusCode('backendSpec')}
                updateStatusCode={(index, field, value) => updateStatusCode('backendSpec', index, field, value)}
                removeStatusCode={(index) => removeStatusCode('backendSpec', index)}
              />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setEndpointModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EndpointSpecFormProps {
  spec?: EndpointSpec
  onUpdate: (spec: EndpointSpec) => void
  addParameter: () => void
  updateParameter: (index: number, field: keyof Parameter, value: any) => void
  removeParameter: (index: number) => void
  addHeader: () => void
  updateHeader: (index: number, field: keyof Header, value: any) => void
  removeHeader: (index: number) => void
  addStatusCode: () => void
  updateStatusCode: (index: number, field: keyof StatusCode, value: any) => void
  removeStatusCode: (index: number) => void
}

function EndpointSpecForm({
  spec,
  onUpdate,
  addParameter,
  updateParameter,
  removeParameter,
  addHeader,
  updateHeader,
  removeHeader,
  addStatusCode,
  updateStatusCode,
  removeStatusCode,
}: EndpointSpecFormProps) {
  const parameters = spec?.parameters || []
  const headers = spec?.headers || []
  const statusCodes = spec?.statusCodes || []

  return (
    <div className="space-y-6">
      {/* Parámetros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Parámetros</CardTitle>
            <Button size="sm" onClick={addParameter}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parameters.map((param, index) => (
              <div key={param.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border p-3 rounded-lg">
                <Input
                  placeholder="Nombre"
                  value={param.name}
                  onChange={(e) => updateParameter(index, 'name', e.target.value)}
                />
                <Select value={param.type} onValueChange={(value) => updateParameter(index, 'type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARAMETER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Valor por defecto"
                  value={param.defaultValue || ''}
                  onChange={(e) => updateParameter(index, 'defaultValue', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={param.required}
                    onChange={(e) => updateParameter(index, 'required', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm">Requerido</label>
                </div>
                <Input
                  placeholder="Descripción"
                  value={param.description || ''}
                  onChange={(e) => updateParameter(index, 'description', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParameter(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {parameters.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay parámetros definidos</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Headers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Headers</CardTitle>
            <Button size="sm" onClick={addHeader}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {headers.map((header, index) => (
              <div key={header.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end border p-3 rounded-lg">
                <Input
                  placeholder="Nombre"
                  value={header.name}
                  onChange={(e) => updateHeader(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Valor"
                  value={header.value || ''}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={header.required}
                    onChange={(e) => updateHeader(index, 'required', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm">Requerido</label>
                </div>
                <Input
                  placeholder="Descripción"
                  value={header.description || ''}
                  onChange={(e) => updateHeader(index, 'description', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHeader(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {headers.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay headers definidos</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Codes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Códigos de Estado</CardTitle>
            <Button size="sm" onClick={addStatusCode}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusCodes.map((status, index) => (
              <div key={status.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border p-3 rounded-lg">
                <Input
                  type="number"
                  placeholder="Código"
                  value={status.code}
                  onChange={(e) => updateStatusCode(index, 'code', parseInt(e.target.value))}
                />
                <Input
                  placeholder="Descripción"
                  value={status.description || ''}
                  onChange={(e) => updateStatusCode(index, 'description', e.target.value)}
                />
                <Textarea
                  placeholder="Response Body (JSON)"
                  value={JSON.stringify(status.responseBody, null, 2) || ''}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateStatusCode(index, 'responseBody', parsed)
                    } catch {
                      // Ignore invalid JSON
                    }
                  }}
                  rows={2}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStatusCode(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {statusCodes.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay códigos de estado definidos</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
