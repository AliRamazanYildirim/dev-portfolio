export const projects = [
  {
    slug: "discover-project",
    title: "Discover App",
    author: "Ali Ramazan",
    mainImage: "/projects/project1.1.png",
    description:
     `Ein umfassendes Event Management System, das auf einer modernen Microservices-Architektur basiert. 
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
    technologies:
      `Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cors, dotenv | 
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
    description:
    "A modern task management application with user authentication, CRUD operations for tasks, and progress tracking. The application offers an intuitive user interface and robust backend functionalities with secure data storage and JWT-based authentication.",
    role: "Frontend & Backend",
    duration: "December 2024",
    category: "Personal Project",
    gallery: [
      "/projects/project2.2.png",
      "/projects/project2.3.png",
      "/projects/project2.4.png",
      "/projects/project2.5.png",
    ],
    technologies:
       "Frontend: React.js, React-Cookie, Vite | Backend: Node.js, Express, PostgreSQL, JWT, Bcrypt | Styling: TailwindCSS | Tools: Bun, Nodemon",
    previousSlug: "discover-project",
    nextSlug: null,
  },
];
