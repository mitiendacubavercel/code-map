import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/endpoints - Obtener todos los endpoints
export async function GET() {
  try {
    const endpoints = await prisma.endpoint.findMany({
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

    // Transformar los datos para que coincidan con la interfaz del store
    const transformedEndpoints = endpoints.map(endpoint => {
      const frontendSpec = endpoint.specs.find(spec => spec.specType === 'frontend')
      const backendSpec = endpoint.specs.find(spec => spec.specType === 'backend')

      return {
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
    })

    return NextResponse.json(transformedEndpoints)
  } catch (error) {
    console.error('Error fetching endpoints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch endpoints' },
      { status: 500 }
    )
  }
}

// POST /api/endpoints - Crear un nuevo endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let projectId = body.projectId;

    // Si no se proporciona projectId, crear o buscar proyecto por defecto
    if (!projectId) {
      let defaultProject = await prisma.project.findFirst({
        where: { name: 'Proyecto Por Defecto' }
      });

      // Si no existe, crearlo
      if (!defaultProject) {
        console.log('Creando proyecto por defecto...');
        defaultProject = await prisma.project.create({
          data: {
            name: 'Proyecto Por Defecto',
            description: 'Proyecto por defecto para endpoints sin proyecto específico',
            isPublic: true,
          }
        });
        console.log('Proyecto por defecto creado:', defaultProject.id);
      }

      projectId = defaultProject.id;
    }

    // Verificar que el proyecto existe (validación adicional)
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: `El proyecto con ID ${projectId} no existe` },
        { status: 400 }
      );
    }

    console.log('Creando endpoint para proyecto:', projectId);

    // Crear el endpoint principal
    const endpoint = await prisma.endpoint.create({
      data: {
        path: body.path,
        method: body.method,
        name: body.name,
        description: body.description,
        status: body.status || 'UNDEFINED',
        projectId: projectId, // Usar el projectId validado
      },
    })

    // Crear las especificaciones frontend y backend si existen
    if (body.frontendSpec) {
      await prisma.endpointSpec.create({
        data: {
          endpointId: endpoint.id,
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

    if (body.backendSpec) {
      await prisma.endpointSpec.create({
        data: {
          endpointId: endpoint.id,
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

    // Obtener el endpoint creado con todas sus relaciones
    const createdEndpoint = await prisma.endpoint.findUnique({
      where: { id: endpoint.id },
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

    return NextResponse.json(createdEndpoint, { status: 201 })
  } catch (error) {
    console.error('Error creating endpoint:', error)
    return NextResponse.json(
      {
        error: 'Failed to create endpoint',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },

      { status: 500 }
    )
  }
}

