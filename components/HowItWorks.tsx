export default function HowItWorks() {
  return (
    <section className="py-32 px-6">
      <h2 className="text-4xl font-bold text-center mb-16">
        How SaSia Works
      </h2>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
        <div>
          <h3 className="text-xl font-semibold">1. Subscribe</h3>
          <p className="text-textMuted mt-3">
            Choose a plan that fits your creator journey.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">2. Request</h3>
          <p className="text-textMuted mt-3">
            Upload content and give instructions.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">3. Receive</h3>
          <p className="text-textMuted mt-3">
            Get professional results — fast.
          </p>
        </div>
      </div>
    </section>
  )
}
