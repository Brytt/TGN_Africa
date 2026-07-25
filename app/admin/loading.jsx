export default function AdminLoading() {
  return (
    <main className="admin-scroll flex-1 overflow-y-auto bg-slate-50/60 p-6 xl:p-10" aria-label="Loading admin page">
      <div className="mx-auto max-w-[1500px] animate-pulse">
        <div className="h-7 w-52 rounded-lg bg-slate-200/80" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200/60" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-white shadow-sm" />)}
        </div>
        <div className="mt-6 h-80 rounded-3xl bg-white shadow-sm" />
      </div>
    </main>
  )
}
