import { LogtoNextConfig } from "@logto/next"

export const logtoConfig: LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  cookieSecret: process.env.LOGTO_COOKIE_ENCRYPTION_KEY!,
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: ["openid", "profile", "email", "offline_access", "roles"],
  resources: [process.env.LOGTO_RESOURCE || ""],
}

