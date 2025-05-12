import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import { Separator } from "@/components/ui/Separator"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const AppHeader = () => {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
  const [actualPath, setActualPath] = useState("")

  useEffect(() => {
    // Construire la chaîne "segment1 | segment2 | …"
    let explicit_path = pathnames
      .map((name, index) => (index === pathnames.length - 1 ? name : name))
      .join(" | ")

    // Si on a exactement "praticien | premierpas", on le remplace par "premier pas"
    explicit_path = explicit_path.replace(
      /^praticien\s*\|\s*premierpas$/i, 
      "Premier pas"
    ) 
    
    explicit_path = explicit_path.replace(
      /completeProfile/i, 
      "Mise à jour profil"
    )

    setActualPath(explicit_path)
  }, [location, pathnames])

  return (
    <header className="flex sticky top-0 z-20 mb-4 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Hello</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{actualPath}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

export default AppHeader
