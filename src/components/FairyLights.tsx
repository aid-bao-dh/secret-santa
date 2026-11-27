"use client";

export default function FairyLights() {
  const bulbs = [
    "bulb-red bg-red-600 shadow-red-500/50",
    "bulb-gold bg-amber-400 shadow-amber-400/50",
    "bulb-green bg-emerald-600 shadow-emerald-500/50",
    "bulb-blue bg-sky-500 shadow-sky-400/50",
    "bulb-red bg-rose-600 shadow-rose-500/50",
    "bulb-gold bg-yellow-400 shadow-yellow-400/50",
    "bulb-green bg-green-600 shadow-green-500/50",
    "bulb-blue bg-cyan-500 shadow-cyan-400/50",
    "bulb-red bg-red-600 shadow-red-500/50",
    "bulb-gold bg-amber-400 shadow-amber-400/50",
    "bulb-green bg-emerald-600 shadow-emerald-500/50",
    "bulb-blue bg-sky-500 shadow-sky-400/50",
    "bulb-red bg-rose-600 shadow-rose-500/50",
    "bulb-gold bg-yellow-400 shadow-yellow-400/50",
    "bulb-green bg-green-600 shadow-green-500/50",
    "bulb-blue bg-cyan-500 shadow-cyan-400/50",
    "bulb-red bg-red-600 shadow-red-500/50",
    "bulb-gold bg-amber-400 shadow-amber-400/50",
    "bulb-green bg-emerald-600 shadow-emerald-500/50",
    "bulb-blue bg-sky-500 shadow-sky-400/50",
  ];

  return (
    <div className="w-full overflow-hidden pointer-events-none relative z-30 select-none pb-2">
      {/* Top Garland Cable */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 shadow-sm" />
      
      {/* Hanging Bulbs with wire sockets */}
      <div className="flex justify-between items-start w-full px-3 sm:px-8 relative -mt-0.5">
        {bulbs.map((bulbClass, i) => (
          <div
            key={i}
            className={`flex-col items-center flex-1 ${
              i % 2 === 0 ? "animate-sway" : "animate-sway-reverse"
            } ${i % 2 !== 0 ? "hidden min-[520px]:flex" : "flex"}`}
            style={{ animationDelay: `${(i % 5) * 0.25}s` }}
          >
            {/* Green wire socket */}
            <div className="w-1.5 h-2 bg-emerald-900 rounded-t-sm" />
            {/* Glowing bulb */}
            <div
              className={`w-3 h-4 sm:w-3.5 sm:h-5 rounded-full shadow-md ${bulbClass}`}
              style={{
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
