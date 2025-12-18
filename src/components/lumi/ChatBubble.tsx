export function ChatBubble({
  who,
  text,
}: {
  who: "kid" | "firefly";
  text: string;
}) {
  const isKid = who === "kid";

  return (
    <div className={`flex ${isKid ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-3xl px-4 py-3 shadow-sm border",
          isKid
            ? "bg-gradient-to-r from-pink-200 to-purple-200 border-white/60"
            : "bg-gradient-to-r from-yellow-200 to-orange-200 border-white/60",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{isKid ? "🧒" : "🪲"}</span>
          <span className="text-sm font-semibold">
            {isKid ? "Você" : "Vagalume"}
          </span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-base">{text}</p>
      </div>
    </div>
  );
}
