import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import GoogleProvider from 'next-auth/providers/google'
import { useRouter } from 'next/router'
import axios from 'axios'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_SECRET,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (credentialsPromise) => {
        try {
          const credentials = (await credentialsPromise) as {
            email: string
            password: string
          }
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
          const data = response.data

          return {
            email: data.email,
            sub: data.email,
            role: data.role,
            accessToken: data.accessToken,
          }
        } catch (error) {
          const credentials = (await credentialsPromise) as {
            email: string
            password: string
          }
          if (axios.isAxiosError(error) && error.response) {
            return {
              error: error.response.data.error || 'Unknown error',
              message: error.response.data.message || 'An error occurred',
              email: credentials.email,
              sub: '',
              role: '',
              accessToken: '',
            }
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account, user }) {
      const cookieStore = cookies()
      const callbackUrl = cookieStore.get('callbackUrl')?.value
      if (account?.provider == 'google') {
        const action = cookieStore.get('auth_action')?.value
        if (action == 'register') {
          try {
            const response = await axios.post(
              `http://localhost:8080/api/users/register-google`,
              {
                email: profile?.email,
                role: 'USER',
                name: profile?.name,
                profilePicture: profile?.picture,
              },
              {
                headers: { 'Content-Type': 'application/json' },
              }
            )
            const data2 = response.data
            if (!data2.success) {
              return '/register?error=email_already_registered'
            }
          } catch (error) {
            return '/register?error=email_already_registered'
          }
        }

        try {
          const responseLogin = await axios.post(
            `http://localhost:8080/api/auth/login-social`,
            {
              email: profile?.email,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
          const dataLogin = responseLogin.data
          user.role = dataLogin.role
          if (dataLogin?.error) {
            user.error = dataLogin.error
          } else {
            user.role = dataLogin.role
            user.accessToken = dataLogin.accessToken
          }
        } catch (error) {
          return `/login?callbackUrl=${callbackUrl}&error=email_not_found`
        }
      }

      if (user.error === 'Email Not Found') {
        return `/login?callbackUrl=${callbackUrl}&error=email_not_found`
      }
      if (user.error === 'Email Not Verified') {
        return `/login?callbackUrl=${callbackUrl}&error=email_not_verified&email=${user.email}`
      }
      if (user.error === 'Invalid Credentials') {
        return `/login?callbackUrl=${callbackUrl}&error=password_not_correct`
      }
      if (user.error) {
        return `/login?callbackUrl=${callbackUrl}&error=${encodeURIComponent(
          user.error
        )}`
      }
      const useCookies = cookies()
      useCookies.set('Sid', user.accessToken, { maxAge: 3600 })
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if (user && user.email) {
          token.sub = user.email
          token.email = user.email
        }
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ token, session }) {
      if (token.email) session.user.email = token.email
      if (token.role) session.user.role = token.role
      if (token.accessToken) session.user.accessToken = token.accessToken
      return session
    },
  },

  session: { strategy: 'jwt', maxAge: 60 * 60 * 1 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  jwt: {
    maxAge: 60 * 60 * 1,
  },
  cookies: {
    sessionToken: {
      name: `session-jwt`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
      },
    },
  },
})
