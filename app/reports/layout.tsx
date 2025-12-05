"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/sidebar-context"
import { AdminGuard } from "@/components/admin-guard"

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-auto lg:ml-0">{children}</main>
        </div>
      </SidebarProvider>
    </AdminGuard>
  )
}
