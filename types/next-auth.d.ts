import 'next-auth'
import 'next-auth/jwt'
import internal from 'stream'

declare module 'next-auth' {
  interface User {
    email: string | undefined | null
    role: string
    accessToken: string
    error?: string
    message?: string
  }

  interface Session {
    user: User
  }

  interface signIn {
    error: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    sub: string
    email: string
    accessToken: string
  }
}
