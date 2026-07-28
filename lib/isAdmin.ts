import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

export async function checkIsAdminOrManager(): Promise<{ authorized: boolean; role?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { authorized: false }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const isAuthorized = profile?.role === "admin" || profile?.role === "manager"
    return { authorized: isAuthorized, role: profile?.role }
  } catch (err) {
    return { authorized: false }
  }
}