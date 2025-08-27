import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/init - Inicializar la base de datos con un proyecto por defecto
export async function POST() {
  try {
    // Verificar si ya existe un proyecto por defecto
    const existingProject = await prisma.project.findFirst({
      where: { name: 'Proyecto Principal' },
    })

    if (existingProject) {
      return NextResponse.json({
        message: 'Project already exists',
        project: existingProject,
      })
    }

    // Crear un proyecto por defecto
    const project = await prisma.project.create({
      data: {
        name: 'Proyecto Principal',
        description: 'Proyecto principal para gestionar endpoints',
        isPublic: true,
      },
    })

    return NextResponse.json({
      message: 'Project created successfully',
      project,
    }, { status: 201 })
  } catch (error) {
    console.error('Error initializing project:', error)
    return NextResponse.json(
      { error: 'Failed to initialize project' },
      { status: 500 }
    )
  }
}
