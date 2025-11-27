export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
          Logs <span className="text-[hsl(280,100%,70%)]">Dashboard</span>
        </h1>
        <p className="max-w-2xl text-center text-xl">
          A full-stack logs dashboard built with the T3 Stack featuring tRPC,
          Prisma, and Next.js.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <h2 className="font-bold text-2xl">Features</h2>
          <ul className="list-inside list-disc space-y-2 text-lg">
            <li>Full CRUD operations for log entries</li>
            <li>Advanced filtering, sorting, and pagination</li>
            <li>Analytics and aggregation endpoints</li>
            <li>Time series chart data</li>
            <li>End-to-end type safety with tRPC</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
