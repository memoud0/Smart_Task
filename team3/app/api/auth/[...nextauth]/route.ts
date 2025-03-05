import { handlers } from "@/app/auth"
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// Define custom types
declare module 'next-auth' {
    interface Session {
      accessToken?: string;
    }
  }
  
  declare module 'next-auth/jwt' {
    interface JWT {
      accessToken?: string;
    }
  }



export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly',
        },
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },  
        },
        async authorize(credentials) {
          const user = { id: '1', name: 'John Smith', email: 'john.smith@example.com', password: 'password' }
          if (credentials.email === user.email && credentials.password === user.password) {
            return user
          } else {
            return null
          }
        }
      })
    ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }: { token: JWT; account: any }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken
      return session
    }
  }
}

export const handler = NextAuth(authOptions)
export const { GET, POST } = handlers