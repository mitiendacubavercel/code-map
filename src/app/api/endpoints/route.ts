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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Datos recibidos:', JSON.stringify(body, null, 2))

    let projectId = body.projectId;

    // Si no se proporciona projectId, crear o buscar proyecto por defecto
    if (!projectId) {
      let defaultProject = await prisma.project.findFirst({
        where: { name: 'Proyecto Por Defecto' }
      });

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

    // Verificar que el proyecto existe
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
        projectId: projectId,
      },
    })

    console.log('Endpoint creado:', endpoint.id);

    // Función helper para crear especificaciones
    const createSpec = async (specData: any, specType: 'frontend' | 'backend') => {
      if (!specData) return null;

      console.log(`Creando spec ${specType}:`, JSON.stringify(specData, null, 2));

      // Crear la especificación principal
      const spec = await prisma.endpointSpec.create({
        data: {
          endpointId: endpoint.id,
          specType: specType,
          requestBody: specData.requestBody || null,
          responseBody: specData.responseBody || null,
          contentType: specData.contentType || null,
          authentication: specData.authentication || null,
          rateLimit: specData.rateLimit || null,
          notes: specData.notes || null,
        },
      });

      console.log(`Spec ${specType} creada:`, spec.id);

      // Crear parameters si existen
      if (specData.parameters && Array.isArray(specData.parameters)) {
        for (const param of specData.parameters) {
          await prisma.parameter.create({
            data: {
              endpointSpecId: spec.id,
              name: param.name,
              type: param.type || 'STRING',
              required: param.required || false,
              description: param.description || null,
              defaultValue: param.defaultValue || null,
              validation: param.validation || null,
            },
          });
        }
        console.log(`${specData.parameters.length} parámetros creados para ${specType}`);
      }

      // Crear headers si existen
      if (specData.headers && Array.isArray(specData.headers)) {
        for (const header of specData.headers) {
          await prisma.header.create({
            data: {
              endpointSpecId: spec.id,
              name: header.name,
              value: header.value || null,
              required: header.required || false,
              description: header.description || null,
            },
          });
        }
        console.log(`${specData.headers.length} headers creados para ${specType}`);
      }

      // Crear status codes si existen
      if (specData.statusCodes && Array.isArray(specData.statusCodes)) {
        for (const statusCode of specData.statusCodes) {
          await prisma.statusCode.create({
            data: {
              endpointSpecId: spec.id,
              code: statusCode.code,
              description: statusCode.description || null,
              responseBody: statusCode.responseBody || null,
            },
          });
        }
        console.log(`${specData.statusCodes.length} status codes creados para ${specType}`);
      }

      return spec;
    };

    // Crear las especificaciones
    if (body.frontendSpec) {
      await createSpec(body.frontendSpec, 'frontend');
    }

    if (body.backendSpec) {
      await createSpec(body.backendSpec, 'backend');
    }

    // ✅ Obtener el endpoint creado con todas sus relaciones
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
    });

    // ✅ VALIDACIÓN AGREGADA: Verificar que el endpoint fue encontrado
    if (!createdEndpoint) {
      console.error('Error: No se pudo recuperar el endpoint creado');
      return NextResponse.json(
        { error: 'Error interno: No se pudo recuperar el endpoint creado' },
        { status: 500 }
      );
    }

    // ✅ Transformar los datos igual que en el GET para consistencia
    const frontendSpec = createdEndpoint.specs.find(spec => spec.specType === 'frontend')
    const backendSpec = createdEndpoint.specs.find(spec => spec.specType === 'backend')

    const transformedEndpoint = {
      id: createdEndpoint.id,
      projectId: createdEndpoint.projectId,
      path: createdEndpoint.path,
      method: createdEndpoint.method,
      name: createdEndpoint.name,
      description: createdEndpoint.description,
      status: createdEndpoint.status,
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
      conflicts: createdEndpoint.conflicts,
    }

    console.log('Endpoint transformado para respuesta:', JSON.stringify(transformedEndpoint, null, 2));

    return NextResponse.json(transformedEndpoint, { status: 201 })

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

