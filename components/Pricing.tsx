export default function Pricing() {
  return (
    <section className="py-32 bg-surface px-6">
      <h2 className="text-4xl font-bold text-center mb-16">
        Simple Pricing
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="p-10 rounded-2xl border border-white/10">
          <h3 className="text-xl">Weekly</h3>
          <p className="text-4xl font-bold mt-4">₹999</p>
        </div>

        <div className="p-10 rounded-2xl border border-accent bg-black scale-105">
          <h3 className="text-xl">Monthly</h3>
          <p className="text-4xl font-bold mt-4">₹2999</p>
        </div>

        <div className="p-10 rounded-2xl border border-white/10">
          <h3 className="text-xl">Yearly</h3>
          <p className="text-4xl font-bold mt-4">₹14999</p>
        </div>
      </div>
    </section>
  )
}
