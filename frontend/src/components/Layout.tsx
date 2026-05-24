export default function Layout({ children }: any) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-black p-4">Circle MLBB</nav>
      <div className="p-4">{children}</div>
    </div>
  )
}