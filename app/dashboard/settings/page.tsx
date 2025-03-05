import type { Metadata } from "next"
import { SettingsForm } from "@/components/settings/settings-form"

export const metadata: Metadata = {
  title: "Settings - BlogGen AI",
  description: "Manage your BlogGen AI account settings",
}

export default function SettingsPage() {
  return <SettingsForm />
}

