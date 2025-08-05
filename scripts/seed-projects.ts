import { db } from '../lib/db'
import type { Prisma } from '.prisma/client' // 🔧 NOT: Type-Import direkt aus dem generierten Prisma-Client

// 🔹 Tippdefinition nur für Seed-Daten (staticProjects)
interface StaticProject {
  slug: string
  title: string
  author: string
  mainImage: string
  description: string
  role: string
  duration: string
  category: string
  technologies: string
  previousSlug: string | null
  nextSlug: string | null
  gallery: string[]
}

// 🔹 Tip tanımı: Prisma-Projekt mit Gallery
type ProjectWithGallery = Prisma.ProjectGetPayload<{
  include: { gallery: true }
}>

// 🔸 Statische Projektdaten
const staticProjects: StaticProject[] = [
  {
    slug: "discover-project",
    title: "Discover App",
    author: "Ali Ramazan",
    mainImage: "/projects/project1.1.png",
    description: `Ein umfassendes Event Management System, das auf einer modernen Microservices-Architektur basiert. 
    Das System bietet Benutzer- und Rechteverwaltung, Event-Verwaltung mit Geo-Lokalisierung, eine REST-API mit Express.js, 
    MongoDB-Integration für flexible Datenspeicherung, eine reaktive Benutzeroberfläche mit React und Vite sowie 
    umfassende Sicherheitsmaßnahmen und Authentifizierung.`,
    role: "Frontend & Backend",
    duration: "August 2024",
    category: "Tutorial Project",
    gallery: [
      "/projects/project1.2.png",
      "/projects/project1.3.png",
      "/projects/project1.4.png",
      "/projects/project1.5.png",
    ],
    technologies: `Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cors, dotenv | 
    Frontend: React, Vite, Axios, React Router, Tailwind CSS, Material-UI | 
    Tools: Bun, Git, VS Code | 
    Deployment: Nginx, Linux`,
    previousSlug: null,
    nextSlug: "todo-project",
  },
  {
    slug: "todo-project",
    title: "Todo Spark App",
    author: "Ali Ramazan",
    mainImage: "/projects/project2.1.png",
    description: "A modern task management application with user authentication, CRUD operations for tasks, and progress tracking. The application offers an intuitive user interface and robust backend functionalities with secure data storage and JWT-based authentication.",
    role: "Frontend & Backend",
    duration: "December 2024",
    category: "Personal Project",
    gallery: [
      "/projects/project2.2.png",
      "/projects/project2.3.png",
      "/projects/project2.4.png",
      "/projects/project2.5.png",
    ],
    technologies: "Frontend: React.js, React-Cookie, Vite | Backend: Node.js, Express, PostgreSQL, JWT, Bcrypt | Styling: TailwindCSS | Tools: Bun, Nodemon",
    previousSlug: "discover-project",
    nextSlug: null,
  },
]

// 🔧 Seeding-Funktion
async function seedProjects() {
  try {
    console.log('🌱 Projekte werden in die Datenbank übertragen...')

    for (const project of staticProjects) {
      const existingProject = await db.project.findUnique({
        where: { slug: project.slug },
      })

      if (existingProject) {
        console.log(`⚠️  Das Projekt existiert bereits: ${project.title}`)
        continue
      }

      const galleryImages = project.gallery.map((url, index) => ({
        url,
        publicId: `portfolio_${project.slug}_${index}`,
        alt: `${project.title} screenshot ${index + 1}`,
        order: index,
      }))

      const createdProject = await db.project.create({
        data: {
          slug: project.slug,
          title: project.title,
          author: project.author,
          description: project.description,
          role: project.role,
          duration: project.duration,
          category: project.category,
          technologies: project.technologies,
          mainImage: project.mainImage,
          previousSlug: project.previousSlug,
          nextSlug: project.nextSlug,
          featured: false,
          published: true,
          gallery: {
            create: galleryImages,
          },
        },
        include: {
          gallery: true,
        },
      })

      console.log(`✅ Projekt erstellt: ${createdProject.title}`)
      console.log(`   📸 ${createdProject.gallery.length} Bilder hinzugefügt`)
    }

    console.log('🎉 Alle Projekte wurden erfolgreich übertragen!')

    const allProjects: ProjectWithGallery[] = await db.project.findMany({
      include: { gallery: true },
    })

    console.log('\n📊 Projekte in der Datenbank:')
    allProjects.forEach((project) => {
      console.log(`- ${project.title} (${project.gallery.length} Bilder)`)
    })
  } catch (error) {
    console.error('❌ Fehler beim Seeding:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

seedProjects()
