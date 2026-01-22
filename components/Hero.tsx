export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-6">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Create More. <br /> Stress Less.
        </h1>

        <p className="mt-6 text-lg text-textMuted">
          SaSia is your premium creative partner for video editing,
          graphics, visuals, and content ideas — all on subscription.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-accent px-8 py-4 rounded-full text-lg">
            Start Creating
          </button>
          <button className="border border-white/20 px-8 py-4 rounded-full text-lg">
            View Pricing
          </button>
        </div>
      </div>
    </section>
  )
}
