export default function AuthCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
      {children}
    </div>
  )
}
