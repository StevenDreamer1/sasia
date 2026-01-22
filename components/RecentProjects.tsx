export default function RecentProjects() {
  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6">
        Recent Projects
      </h3>

      <div className="space-y-4 text-textMuted">
        <div className="flex justify-between">
          <span>Instagram Reel Edit</span>
          <span>In Progress</span>
        </div>

        <div className="flex justify-between">
          <span>YouTube Video Edit</span>
          <span>Completed</span>
        </div>

        <div className="flex justify-between">
          <span>Thumbnail Design</span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  )
}
