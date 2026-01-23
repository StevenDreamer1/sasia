import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { Otp } from "@/models/Otp";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        await dbConnect();

        // OTP Login Logic
        if (credentials?.otp) {
          const validOtp = await Otp.findOne({ 
            email: credentials.email, 
            code: credentials.otp 
          });

          if (!validOtp) throw new Error("Invalid or Expired OTP");

          let user = await User.findOne({ email: credentials.email });
          if (!user) {
            user = await User.create({ 
              email: credentials.email, 
              name: "New User", 
              role: "user" 
            });
          }
          await Otp.deleteOne({ _id: validOtp._id });
          return user;
        }

        // Password Login Logic
        if (credentials?.password) {
          const user = await User.findOne({ email: credentials.email });
          if (!user) throw new Error("No user found.");
          if (!user.password) throw new Error("Please login with Google or OTP.");

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect Password.");

          return user;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user._id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: "user",
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};