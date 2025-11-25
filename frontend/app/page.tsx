import { redirect } from "next/navigation"

export default function Home() {
  // Redirect ke halaman login atau dashboard
  redirect("/login")
}
