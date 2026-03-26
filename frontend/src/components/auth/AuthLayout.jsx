export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-12 h-72 w-72 rounded-full bg-amber-300/35 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-zinc-300/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7)_0,rgba(255,255,255,0)_50%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full items-center justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
        <div className="w-full max-w-[min(96vw,30rem)] sm:max-w-[min(88vw,35rem)] lg:max-w-[min(72vw,42rem)] xl:max-w-184">
          {children}
        </div>
      </div>
    </div>
  );
}
