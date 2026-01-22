export default function DashboardStats() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="p-6 rounded-xl bg-surface border border-white/10">
        <p className="text-textMuted">Active Plan</p>
        <h3 className="text-2xl font-bold mt-2">Monthly</h3>
      </div>

      <div className="p-6 rounded-xl bg-surface border border-white/10">
        <p className="text-textMuted">Days Remaining</p>
        <h3 className="text-2xl font-bold mt-2">18</h3>
      </div>

      <div className="p-6 rounded-xl bg-surface border border-white/10">
        <p className="text-textMuted">Active Requests</p>
        <h3 className="text-2xl font-bold mt-2">2</h3>
      </div>
    </div>
  )
}
