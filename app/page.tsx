import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import HowItWorks from "@/components/HowItWorks"
import Pricing from "@/components/Pricing"
import CTA from "@/components/CTA"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
      <CTA />
    </>
  )
}
