import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import GoogleProvider from 'next-auth/providers/google'
import { useRouter } from 'next/router'

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
          const credentials = (await await credentialsPromise) as {
            email: string
            password: string
          }
          const response = await fetch(`http://localhost:8080/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })
          const data = await response.json()

          // const useCookies = cookies()
          // useCookies.set('Sid', data.accessToken)
          // console.log(response)
          if (!response.ok) {
            return {
              error: data.error,
              message: data.message,
              email: credentials.email,
              sub: '',
              role: '',
              accessToken: '',
            }
          }
          return {
            email: data.email,
            sub: data.email,
            role: data.role,
            accessToken: data.accessToken,
          }
        } catch (error) {
          console.log(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account, user }) {
      if (account?.provider == 'google') {
        const cookieStore = cookies()
        const action = cookieStore.get('auth_action')?.value
        if (action == 'register') {
          const response = await fetch(
            `http://localhost:8080/api/users/register-google`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: profile?.email,
                role: 'USER',
                name: profile?.name,
                profilePicture: profile?.picture,
              }),
            }
          )
          const data2 = await response.json()
          if (!data2.success) {
            return '/register?error=email_already_registered'
          }
        }

        const responseLogin = await fetch(
          `http://localhost:8080/api/auth/login-social`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: profile?.email,
            }),
          }
        )
        const dataLogin = await responseLogin.json()
        user.role = dataLogin.role
        if (dataLogin?.error) {
          user.error = dataLogin.error
        } else {
          user.role = dataLogin.role
          user.accessToken = dataLogin.accessToken
        }
      }

      if (user.error === 'Email Not Found') {
        return '/login?error=email_not_found'
      }
      if (user.error === 'Email Not Verified') {
        return `/login?error=email_not_verified&email=${user.email}`
      }
      if (user.error === 'Invalid Credentials') {
        return '/login?error=password_not_correct'
      }
      const useCookies = cookies()
      useCookies.set('Sid', user.accessToken)

      return '/'
    },
    async session({ token, session }) {
      if (token.email) session.user.email = token.email
      if (token.role) session.user.role = token.role
      if (token.accessToken) session.user.accessToken = token.accessToken
      return session
    },
    async jwt({ token, user }) {
      // console.log(token)
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
  },

  session: { strategy: 'jwt', maxAge: 60 * 60 * 1 },
  pages: {
    signIn: '/login',
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
