import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/endpoints/[id] - Obtener un endpoint específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const endpoint = await prisma.endpoint.findUnique({
      where: { id: params.id },
      include: {
        specs: {
          include: {
            parameters: true,
            headers: true,
            statusCodes: true,
          },
        },
        conflicts: true,
      },
    })

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint not found' },
        { status: 404 }
      )
    }

    // Transformar los datos para que coincidan con la interfaz del store
    const frontendSpec = endpoint.specs.find(spec => spec.specType === 'frontend')
    const backendSpec = endpoint.specs.find(spec => spec.specType === 'backend')

    const transformedEndpoint = {
      id: endpoint.id,
      path: endpoint.path,
      method: endpoint.method,
      name: endpoint.name,
      description: endpoint.description,
      status: endpoint.status,
      frontendSpec: frontendSpec ? {
        id: frontendSpec.id,
        requestBody: frontendSpec.requestBody,
        responseBody: frontendSpec.responseBody,
        parameters: frontendSpec.parameters,
        headers: frontendSpec.headers,
        statusCodes: frontendSpec.statusCodes,
        contentType: frontendSpec.contentType,
        authentication: frontendSpec.authentication,
        rateLimit: frontendSpec.rateLimit,
        notes: frontendSpec.notes,
      } : undefined,
      backendSpec: backendSpec ? {
        id: backendSpec.id,
        requestBody: backendSpec.requestBody,
        responseBody: backendSpec.responseBody,
        parameters: backendSpec.parameters,
        headers: backendSpec.headers,
        statusCodes: backendSpec.statusCodes,
        contentType: backendSpec.contentType,
        authentication: backendSpec.authentication,
        rateLimit: backendSpec.rateLimit,
        notes: backendSpec.notes,
      } : undefined,
      conflicts: endpoint.conflicts,
    }

    return NextResponse.json(transformedEndpoint)
  } catch (error) {
    console.error('Error fetching endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch endpoint' },
      { status: 500 }
    )
  }
}

// PUT /api/endpoints/[id] - Actualizar un endpoint
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Actualizar el endpoint principal
    const updatedEndpoint = await prisma.endpoint.update({
      where: { id: params.id },
      data: {
        path: body.path,
        method: body.method,
        name: body.name,
        description: body.description,
        status: body.status,
      },
    })

    // Actualizar o crear las especificaciones
    if (body.frontendSpec) {
      const existingFrontendSpec = await prisma.endpointSpec.findFirst({
        where: {
          endpointId: params.id,
          specType: 'frontend',
        },
      })

      if (existingFrontendSpec) {
        await prisma.endpointSpec.update({
          where: { id: existingFrontendSpec.id },
          data: {
            requestBody: body.frontendSpec.requestBody,
            responseBody: body.frontendSpec.responseBody,
            contentType: body.frontendSpec.contentType,
            authentication: body.frontendSpec.authentication,
            rateLimit: body.frontendSpec.rateLimit,
            notes: body.frontendSpec.notes,
          },
        })
      } else {
        await prisma.endpointSpec.create({
          data: {
            endpointId: params.id,
            specType: 'frontend',
            requestBody: body.frontendSpec.requestBody,
            responseBody: body.frontendSpec.responseBody,
            contentType: body.frontendSpec.contentType,
            authentication: body.frontendSpec.authentication,
            rateLimit: body.frontendSpec.rateLimit,
            notes: body.frontendSpec.notes,
          },
        })
      }
    }

    if (body.backendSpec) {
      const existingBackendSpec = await prisma.endpointSpec.findFirst({
        where: {
          endpointId: params.id,
          specType: 'backend',
        },
      })

      if (existingBackendSpec) {
        await prisma.endpointSpec.update({
          where: { id: existingBackendSpec.id },
          data: {
            requestBody: body.backendSpec.requestBody,
            responseBody: body.backendSpec.responseBody,
            contentType: body.backendSpec.contentType,
            authentication: body.backendSpec.authentication,
            rateLimit: body.backendSpec.rateLimit,
            notes: body.backendSpec.notes,
          },
        })
      } else {
        await prisma.endpointSpec.create({
          data: {
            endpointId: params.id,
            specType: 'backend',
            requestBody: body.backendSpec.requestBody,
            responseBody: body.backendSpec.responseBody,
            contentType: body.backendSpec.contentType,
            authentication: body.backendSpec.authentication,
            rateLimit: body.backendSpec.rateLimit,
            notes: body.backendSpec.notes,
          },
        })
      }
    }

    return NextResponse.json(updatedEndpoint)
  } catch (error) {
    console.error('Error updating endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to update endpoint' },
      { status: 500 }
    )
  }
}

// DELETE /api/endpoints/[id] - Eliminar un endpoint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.endpoint.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Endpoint deleted successfully' })
  } catch (error) {
    console.error('Error deleting endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to delete endpoint' },
      { status: 500 }
    )
  }
}
