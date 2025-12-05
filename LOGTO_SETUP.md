# Logto Authentication Setup Guide

This guide will help you set up Logto authentication with role-based access control (RBAC) for your application.

## Prerequisites

1. A Logto account (sign up at https://cloud.logto.io)
2. A Logto application created in your Logto dashboard

## Step 1: Configure Logto Application

1. **Create a Logto Application:**
   - Go to your Logto dashboard
   - Navigate to "Applications" and create a new application
   - Note down your `App ID` and `App Secret`

2. **Configure Redirect URIs:**
   - Add these redirect URIs in your Logto application settings:
     - `http://localhost:3001/api/logto/callback` (for development)
     - `https://your-domain.com/api/logto/callback` (for production)

3. **Set up API Resource (for roles):**
   - Go to "API Resources" in your Logto dashboard
   - Create a new API resource or use an existing one
   - Note the resource identifier

4. **Configure Roles:**
   - Go to "Roles" in your Logto dashboard
   - Create roles (e.g., "admin", "user", "viewer")
   - Assign these roles to users as needed

## Step 2: Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Logto Configuration
LOGTO_ENDPOINT=https://your-logto-instance.logto.app
LOGTO_APP_ID=your-app-id
LOGTO_APP_SECRET=your-app-secret
LOGTO_BASE_URL=http://localhost:3001
LOGTO_COOKIE_ENCRYPTION_KEY=your-32-character-encryption-key-here
LOGTO_RESOURCE=your-resource-identifier

# Application URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Generating Cookie Encryption Key

You can generate a secure 32-character key using:

```bash
openssl rand -base64 32
```

Or use any secure random string generator.

## Step 3: Update Logto Application Settings

In your Logto dashboard, make sure:

1. **Scopes are enabled:**
   - `openid`
   - `profile`
   - `email`
   - `offline_access`
   - `roles` (for role-based access)

2. **Post Sign-in Redirect URI:**
   - Set to: `http://localhost:3001/reports` (or your desired landing page)

3. **Post Sign-out Redirect URI:**
   - Set to: `http://localhost:3001`

## Step 4: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3001`
   - You should be redirected to Logto for authentication
   - After signing in, you'll be redirected back to your app

3. Check user roles:
   - The sidebar will show an "Admin" link if the user has the "admin" role
   - You can check user info in the header

## Role-Based Access Control

### Checking Roles in Components

Use the `useLogtoUser` hook to check user roles:

```tsx
import { useLogtoUser } from "@/hooks/use-logto"

function MyComponent() {
  const { isAdmin, hasRole, roles } = useLogtoUser()
  
  if (isAdmin) {
    // Show admin content
  }
  
  if (hasRole("editor")) {
    // Show editor content
  }
}
```

### Protecting Routes

You can protect routes by checking authentication in your page components:

```tsx
"use client"

import { useLogtoUser } from "@/hooks/use-logto"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useLogtoUser()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/api/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router])
  
  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>
  }
  
  return <div>Protected Content</div>
}
```

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch" error:**
   - Make sure the redirect URI in your Logto app settings matches exactly with your callback URL
   - Check both development and production URLs

2. **Roles not showing:**
   - Ensure the "roles" scope is enabled in your Logto application
   - Verify that users have roles assigned in the Logto dashboard
   - Check that the API resource is properly configured

3. **Authentication not working:**
   - Verify all environment variables are set correctly
   - Check that `LOGTO_COOKIE_ENCRYPTION_KEY` is exactly 32 characters
   - Ensure `LOGTO_BASE_URL` matches your application URL

## Additional Resources

- [Logto Documentation](https://docs.logto.io)
- [Logto Next.js Integration Guide](https://docs.logto.io/quick-starts/next)
- [Role-Based Access Control](https://docs.logto.io/authorization/role-based-access-control)

