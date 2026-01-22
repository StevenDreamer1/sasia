import AuthCard from "@/components/AuthCard"
import Link from "next/link"

export default function SignupPage() {
  return (
    <AuthCard title="Create your account">
      <form className="space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-black border border-white/10 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-black border border-white/10 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-black border border-white/10 focus:outline-none"
        />

        <button className="w-full bg-accent py-3 rounded-full font-medium">
          Sign Up
        </button>
      </form>

      <p className="text-textMuted text-sm mt-6 text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-white">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}
