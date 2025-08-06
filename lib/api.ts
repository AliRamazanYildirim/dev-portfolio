// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

// Project types
export interface ProjectCreateInput {
  slug: string
  title: string
  description: string
  role: string
  duration: string
  category: string
  technologies: string
  mainImage: string
  gallery?: string[]
  featured?: boolean
  previousSlug?: string | null
  nextSlug?: string | null
}

export interface ProjectUpdateInput {
  title?: string
  description?: string
  role?: string
  duration?: string
  category?: string
  technologies?: string
  mainImage?: string
  gallery?: string[]
  featured?: boolean
  previousSlug?: string | null
  nextSlug?: string | null
  published?: boolean
}

// API Client Functions
export class ProjectsAPI {
  private static baseUrl = '/api/projects'

  // Alle Projekte abrufen
  static async getAll(options?: {
    featured?: boolean
    limit?: number
  }): Promise<ApiResponse> {
    const params = new URLSearchParams()
    if (options?.featured) params.append('featured', 'true')
    if (options?.limit) params.append('limit', options.limit.toString())
    
    const response = await fetch(`${this.baseUrl}?${params}`)
    return response.json()
  }

  // Einzelnes Projekt abrufen
  static async getBySlug(slug: string): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/${slug}`)
    return response.json()
  }

  // Neues Projekt erstellen
  static async create(data: ProjectCreateInput): Promise<ApiResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Projekt aktualisieren
  static async update(slug: string, data: ProjectUpdateInput): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Projekt löschen
  static async delete(slug: string): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/${slug}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

// API Error Handler
export function handleApiError(error: any): string {
  if (error?.message) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}
