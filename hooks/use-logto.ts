"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface UserInfo {
  sub?: string
  name?: string
  email?: string
  picture?: string
  roles?: string[]
  [key: string]: unknown
}

export function useLogtoUser() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/user")
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data)
          setIsAuthenticated(true)
        } else {
          setUserInfo(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUserInfo(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const userRoles = useMemo(() => {
    if (!userInfo) return []
    // Logto roles can be in different places depending on configuration
    // Check common locations: roles, customData.roles, or organizationRoles
    const roles =
      userInfo.roles ||
      (userInfo.customData as { roles?: string[] })?.roles ||
      (userInfo.organizationRoles as string[]) ||
      []
    return Array.isArray(roles) ? roles : []
  }, [userInfo])

  const hasRole = (role: string) => {
    return userRoles.includes(role)
  }

  const isAdmin = hasRole("admin")

  const signIn = (redirectTo?: string) => {
    const redirect = redirectTo || window.location.pathname
    window.location.href = `/api/auth/sign-in?redirectTo=${encodeURIComponent(redirect)}`
  }

  const signOut = () => {
    window.location.href = "/api/auth/sign-out"
  }

  return {
    isAuthenticated,
    isLoading,
    user: userInfo,
    roles: userRoles,
    hasRole,
    isAdmin,
    signIn,
    signOut,
  }
}

