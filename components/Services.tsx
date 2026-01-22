const services = [
  "🎬 Video Editing",
  "🎨 GFX & Motion Graphics",
  "🎥 Videography",
  "📸 Photography",
  "✍️ Content Ideas & Scripts",
]

export default function Services() {
  return (
    <section className="py-32 bg-surface px-6">
      <h2 className="text-4xl font-bold text-center mb-16">
        What SaSia Does
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-black border border-white/10 hover:border-accent transition"
          >
            <h3 className="text-xl font-semibold">{s}</h3>
            <p className="mt-3 text-textMuted">
              Premium quality tailored for creators.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
