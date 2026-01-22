export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold">SaSia</h1>

        <div className="hidden md:flex gap-8 text-sm text-textMuted">
          <a href="#">Services</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
        </div>

        <button className="bg-accent px-5 py-2 rounded-full text-sm font-medium">
          Get Started
        </button>
      </div>
    </nav>
  )
}
