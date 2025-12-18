export function FireflyTeacher() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/80 border shadow-sm">
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.55)]" />
        <span className="text-3xl">🪲</span>
      </div>

      <div>
        <p className="text-lg font-extrabold leading-none">Lumi Kids</p>
        <p className="text-sm text-muted-foreground">
          Aprender pode ser divertido ✨
        </p>
      </div>
    </div>
  );
}
