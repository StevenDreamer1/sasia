import DashboardSidebar from "@/components/DashboardSidebar"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardStats from "@/components/DashboardStats"
import RecentProjects from "@/components/RecentProjects"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <DashboardSidebar />

      <main className="flex-1 p-10">
        <DashboardHeader />
        <DashboardStats />
        <RecentProjects />
      </main>
    </div>
  )
}
