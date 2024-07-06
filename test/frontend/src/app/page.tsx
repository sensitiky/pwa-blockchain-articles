"use client"

import { format } from 'date-fns';
import { JSX, SVGProps, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  const [categories, setCategories] = useState([
    "Tecnología",
    "Negocios",
    "Estilo de vida",
    "Entretenimiento",
    "Salud",
    "Viajes",
    "Deportes",
  ])
  const [tags, setTags] = useState(["Tendencias", "Innovación", "Emprendimiento", "Bienestar", "Aventura"])
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "La revolución del comercio electrónico",
      content: "Descubre cómo el comercio electrónico está transformando la forma en que hacemos negocios.",
      author: {
        name: "Juan Pérez",
        socialLinks: {
          twitter: "https://twitter.com/juanperez",
          instagram: "https://www.instagram.com/juanperez/",
          linkedin: "https://www.linkedin.com/in/juanperez",
        },
      },
      categories: ["Negocios", "Tecnología"],
      tags: ["Tendencias", "Emprendimiento"],
      createdAt: "2023-06-01",
    },
    {
      id: 2,
      title: "Consejos para una vida saludable",
      content: "Aprende a adoptar hábitos saludables que te ayudarán a mejorar tu bienestar.",
      author: {
        name: "María Gómez",
        socialLinks: {
          instagram: "https://www.instagram.com/mariagomez/",
          youtube: "https://www.youtube.com/user/mariagomez",
        },
      },
      categories: ["Salud", "Estilo de vida"],
      tags: ["Bienestar", "Tendencias"],
      createdAt: "2023-05-15",
    },
    {
      id: 3,
      title: "Los mejores destinos para viajar este verano",
      content: "Descubre los lugares más emocionantes para disfrutar de tus vacaciones de verano.",
      author: {
        name: "Ana Rodríguez",
        socialLinks: {
          twitter: "https://twitter.com/anarodriguez",
          instagram: "https://www.instagram.com/anarodriguez/",
        },
      },
      categories: ["Viajes", "Entretenimiento"],
      tags: ["Aventura", "Tendencias"],
      createdAt: "2023-04-20",
    },
  ])
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-slate-900 py-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <Link href="#" className="text-2xl font-bold text-white" prefetch={false}>
            Blogchain
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="secondary">Crear publicación</Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="container mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 py-8 px-4 md:px-6">
        <div className="bg-card rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {categories.map((category, index) => (
              <Button key={index} variant="ghost" className="justify-start">
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-card rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Etiquetas</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="hover:bg-secondary/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {posts.map((post, index) => (
              <Card key={index} className="bg-card rounded-lg shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href="#" className="font-semibold" prefetch={false}>
                          {post.author.name}
                        </Link>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                          <Separator orientation="vertical" />
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" />
                            <span>123</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircleIcon className="w-4 h-4" />
                            <span>45</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {post.author.socialLinks.twitter && (
                          <Link href="#" prefetch={false}>
                            <TwitterIcon className="w-4 h-4" />
                          </Link>
                        )}
                        {post.author.socialLinks.instagram && (
                          <Link href="#" prefetch={false}>
                            <InstagramIcon className="w-4 h-4" />
                          </Link>
                        )}
                        {post.author.socialLinks.linkedin && (
                          <Link href="#" prefetch={false}>
                            <LinkedinIcon className="w-4 h-4" />
                          </Link>
                        )}
                        {post.author.socialLinks.youtube && (
                          <Link href="#" prefetch={false}>
                            <YoutubeIcon className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.content}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="hover:bg-secondary/50">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="hover:bg-secondary/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-muted p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Empresa</h3>
            <Link href="#" prefetch={false}>
              Acerca de
            </Link>
            <Link href="#" prefetch={false}>
              Equipo
            </Link>
            <Link href="#" prefetch={false}>
              Carreras
            </Link>
            <Link href="#" prefetch={false}>
              Noticias
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Categorías</h3>
            {categories.map((category, index) => (
              <Link key={index} href="#" prefetch={false}>
                {category}
              </Link>
            ))}
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Recursos</h3>
            <Link href="#" prefetch={false}>
              Blog
            </Link>
            <Link href="#" prefetch={false}>
              Comunidad
            </Link>
            <Link href="#" prefetch={false}>
              Soporte
            </Link>
            <Link href="#" prefetch={false}>
              Preguntas frecuentes
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <Link href="#" prefetch={false}>
              Política de privacidad
            </Link>
            <Link href="#" prefetch={false}>
              Términos de servicio
            </Link>
            <Link href="#" prefetch={false}>
              Política de cookies
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Contacto</h3>
            <Link href="#" prefetch={false}>
              Soporte
            </Link>
            <Link href="#" prefetch={false}>
              Ventas
            </Link>
            <Link href="#" prefetch={false}>
              Prensa
            </Link>
            <Link href="#" prefetch={false}>
              Asociaciones
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function InstagramIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}


function LinkedinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}


function MessageCircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}


function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}


function YoutubeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}