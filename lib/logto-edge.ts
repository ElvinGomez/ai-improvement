import LogtoClient from "@logto/next/edge"
import { logtoConfig } from "./logto"

export const logtoEdgeClient = new LogtoClient(logtoConfig)

