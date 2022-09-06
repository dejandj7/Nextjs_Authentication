import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const callbacks = {
  redirect({ baseUrl }) {
    return baseUrl
  },
  async signIn({ user }) {
    return user
  },
  // async jwt({ token, user }) {
  //   if (user) {
  //     token.accessToken = user.token
  //     token.user = user
  //     token.email = user.email
  //     token.name = user.name
  //   }
  //   return token
  // },
  // async session({ session, token }) {
  //   session.accessToken = token.accessToken
  //   session.user = token.user
  //   session.email = token.email
  //   session.name = token.name
  //   return session
  // }
}

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    })
  ],
  callbacks,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
    //newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60 // 30 minutes
  },
  jwt: {
    secret: '1g9BVIJWkrQkLUwTW67bjgDX7Abj3CX58RYZ5BOIUM4'
  },
  secret: '1g9BVIJWkrQkLUwTW67bjgDX7Abj3CX58RYZ5BOIUM4',
}

export default (req, res) => NextAuth(req, res, options)