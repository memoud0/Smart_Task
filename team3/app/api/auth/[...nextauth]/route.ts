import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth environment variables");
}

const authOptions: NextAuthOptions = {
    providers: [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user}){
            //This is a placeholder. We should use the user's email to retrieve user_id from DB
            token.id = user.email;
            return token;
        },
    }
}
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}