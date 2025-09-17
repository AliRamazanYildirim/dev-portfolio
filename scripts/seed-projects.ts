import { db } from '../lib/db'
import ProjectModel from '@/models/Project'
import ProjectImageModel from '@/models/ProjectImage'
import { connectToMongo } from '@/lib/mongodb'
// Removed Prisma runtime/type dependency for seeding — use local types instead

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

// Prisma-specific types removed for seed script — using local `StaticProject` type instead

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

    // Ensure MongoDB is connected before running any model operations
    try {
      await connectToMongo()
    } catch (connErr) {
      console.error('❌ Fehler beim Verbinden zu MongoDB:', connErr)
      process.exit(1)
    }

    for (const project of staticProjects) {
      const existingProject = await ProjectModel.findOne({ slug: project.slug }).exec()

      if (existingProject) {
        console.log(`⚠️  Das Projekt existiert bereits: ${project.title}`)
        continue
      }

      // Create project
      const createdProject = await ProjectModel.create({
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
      })

      const galleryImages = project.gallery.map((url, index) => ({
        projectId: createdProject._id,
        url,
        publicId: `portfolio_${project.slug}_${index}`,
        alt: `${project.title} screenshot ${index + 1}`,
        order: index,
      }))

      await ProjectImageModel.insertMany(galleryImages)

      console.log(`✅ Projekt erstellt: ${createdProject.title}`)
      console.log(`   📸 ${galleryImages.length} Bilder hinzugefügt`)
    }

    console.log('🎉 Alle Projekte wurden erfolgreich übertragen!')

    const allProjects = await ProjectModel.find().lean().exec()

    console.log('\n📊 Projekte in der Datenbank:')
    for (const p of allProjects) {
      const images = await ProjectImageModel.find({ projectId: p._id }).lean().exec()
      console.log(`- ${p.title} (${images.length} Bilder)`)
    }
  } catch (error) {
    console.error('❌ Fehler beim Seeding:', error)
    process.exit(1)
  } finally {
    try {
      const conn = await connectToMongo()
      if (conn && typeof (conn as any).close === 'function') await (conn as any).close()
    } catch (e) {
      // ignore
    }
  }
}

seedProjects()
