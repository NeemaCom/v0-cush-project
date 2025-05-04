import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const createClient = () => {
  return createPagesServerClient({
    headers: {
      get: (key: string) => {
        return cookies().get(key)?.value
      },
      set: (key: string, value: string) => {
        cookies().set(key, value)
      },
      delete: (key: string) => {
        cookies().delete(key)
      },
    },
  })
}
