export function FunBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* céu colorido */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,0,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,105,180,0.28),transparent_40%),radial-gradient(circle_at_30%_80%,rgba(0,200,255,0.25),transparent_45%),linear-gradient(to_bottom,rgba(255,248,210,1),rgba(255,235,245,1),rgba(220,255,245,1))]" />

      {/* nuvens */}
      <div className="absolute -top-6 left-6 h-24 w-48 rounded-full bg-white/60 blur-sm" />
      <div className="absolute top-10 left-40 h-16 w-32 rounded-full bg-white/50 blur-sm" />
      <div className="absolute top-6 right-10 h-20 w-44 rounded-full bg-white/55 blur-sm" />

      {/* vagalumes (bolinhas brilhantes) */}
      <div className="absolute left-[8%] top-[28%] h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(255,215,0,0.85)] animate-pulse" />
      <div className="absolute left-[18%] top-[52%] h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(255,215,0,0.8)] animate-pulse" />
      <div className="absolute right-[14%] top-[34%] h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(255,215,0,0.85)] animate-pulse" />
      <div className="absolute right-[26%] top-[58%] h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(255,215,0,0.8)] animate-pulse" />

      {/* grama (rodapé) */}
      <div className="absolute -bottom-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-[999px] bg-gradient-to-b from-green-200/80 to-green-300/80 blur-[1px]" />
    </div>
  );
}
