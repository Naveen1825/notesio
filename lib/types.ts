import type { ReactNode } from "react"

export interface SlashCommand {
  id: string
  label: string
  icon: ReactNode
  action: string
  description: string
}
