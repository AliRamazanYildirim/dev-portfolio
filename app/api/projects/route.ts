import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/projects - Tüm projeleri getir
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const projects = await db.project.findMany({
      where: {
        published: true,
        ...(featured === 'true' && { featured: true })
      },
      include: {
        gallery: {
          orderBy: { order: 'asc' }
        },
        tags: true
      },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: parseInt(limit) })
    })

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Yeni proje oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slug,
      title,
      description,
      role,
      duration,
      category,
      technologies,
      mainImage,
      gallery = [],
      featured = false,
      previousSlug,
      nextSlug
    } = body

    // Slug benzersizliğini kontrol et
    const existingProject = await db.project.findUnique({
      where: { slug }
    })

    if (existingProject) {
      return NextResponse.json(
        { success: false, error: 'A project with this slug already exists' },
        { status: 400 }
      )
    }

    // Galeri resimlerini hazırla
    const galleryData = gallery.map((url: string, index: number) => ({
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index
    }))

    const project = await db.project.create({
      data: {
        slug,
        title,
        description,
        role,
        duration,
        category,
        technologies,
        mainImage,
        featured,
        previousSlug,
        nextSlug,
        gallery: {
          create: galleryData
        }
      },
      include: {
        gallery: {
          orderBy: { order: 'asc' }
        },
        tags: true
      }
    })

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
