import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

export interface BarometerHeroProps {
  title?: string;
  lastUpdated?: string;
  totalLabel?: string;
  totalAmount?: number;
  todayLabel?: string;
  todayCount?: number;
  todaySuffix?: string;
  soonCount?: number;
  soonLabel?: string;
  lateCount?: number;
  lateLabel?: string;
  className?: string;
  autoAnimate?: boolean;
  intervalMs?: number;
}

/**
 * Formats a number into dot-separated Indonesian format (e.g. 438790400 -> "438.790.400")
 */
const formatOdometerValue = (val: number): string => {
  return val.toLocaleString("id-ID");
};

/**
 * Gets formatted current time string
 */
const getCurrentTimeString = (): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `Terakhir diperbarui: ${dateStr} - ${timeStr}`;
};

export const BarometerHero: React.FC<BarometerHeroProps> = ({
  title = "MANDIRI CELL LOAN MONITOR",
  lastUpdated: initialLastUpdated,
  totalLabel = "TOTAL PIUTANG AKTIF",
  totalAmount = 438790400,
  todayLabel = "JATUH TEMPO HARI INI",
  todayCount = 17,
  todaySuffix = "TAGIHAN",
  soonCount = 8,
  soonLabel = "Segera Jatuh Tempo",
  lateCount = 5,
  lateLabel = "Terlambat",
  className = "",
  autoAnimate = true,
  intervalMs = 1500,
}) => {
  const [currentAmount, setCurrentAmount] = useState<number>(totalAmount);
  const [currentToday, setCurrentToday] = useState<number>(todayCount);
  const [updatedTimeText, setUpdatedTimeText] = useState<string>(
    initialLastUpdated || getCurrentTimeString()
  );

  // Synchronize initial prop changes
  useEffect(() => {
    setCurrentAmount(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    setCurrentToday(todayCount);
  }, [todayCount]);

  // Auto-animation interval
  useEffect(() => {
    if (!autoAnimate) return;

    const timer = setInterval(() => {
      // Random increment between 50 and 750
      const increment = Math.floor(Math.random() * 70) * 10 + 50;
      setCurrentAmount((prev) => prev + increment);
      setUpdatedTimeText(getCurrentTimeString());

      // 20% chance to increment today's count
      if (Math.random() < 0.2) {
        setCurrentToday((prev) => prev + 1);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoAnimate, intervalMs]);

  const formattedTotal = formatOdometerValue(currentAmount);
  const totalChars = formattedTotal.split("");

  const formattedToday = String(currentToday);
  const todayChars = formattedToday.split("");

  return (
    <div
      className={`background__gradient rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center ${className}`}
    >
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Title & Subtitle */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white uppercase drop-shadow-md">
        {title}
      </h1>
      <p className="mt-1 text-[11px] sm:text-xs font-semibold text-cyan-100/90 tracking-wide flex items-center justify-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        {updatedTimeText}
      </p>

      {/* Section 1: Total Piutang Aktif */}
      <div className="w-full max-w-5xl mt-4 flex flex-col items-center">
        {/* Line Divider */}
        <div className="flex items-center justify-center gap-3 w-full my-2 px-2">
          <div className="h-[1.5px] flex-1 max-w-[200px] sm:max-w-[320px] md:max-w-[450px] bg-gradient-to-r from-transparent via-cyan-300 to-cyan-400 relative">
            <span className="absolute right-0 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-widest text-cyan-100 uppercase shrink-0">
            {totalLabel}
          </span>
          <div className="h-[1.5px] flex-1 max-w-[200px] sm:max-w-[320px] md:max-w-[450px] bg-gradient-to-l from-transparent via-cyan-300 to-cyan-400 relative">
            <span className="absolute left-0 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>

        {/* Large Odometer Casing - BIG & Fills Card */}
        <div className="odometer-casing my-3 px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-4xl sm:text-6xl md:text-7xl lg:text-[80px] rounded-2xl md:rounded-3xl border-4 border-slate-900/90 shadow-2xl max-w-full overflow-x-auto">
          <span className="text-[#eee0d3] font-bold mr-2 sm:mr-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl select-none">
            Rp
          </span>
          {totalChars.map((char, index) => {
            if (char === "." || char === ",") {
              return (
                <span
                  key={`dot-${index}`}
                  className="odometer-separator text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#eee0d3] px-1 self-end pb-1 sm:pb-2 font-black"
                >
                  {char}
                </span>
              );
            }
            return (
              <span key={`digit-${index}`} className="odometer-digit">
                <span key={`${index}-${char}`} className="odometer-digit-inner">
                  {char}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Section 2: Jatuh Tempo Hari Ini */}
      <div className="w-full max-w-3xl mt-3 flex flex-col items-center">
        {/* Line Divider */}
        <div className="flex items-center justify-center gap-3 w-full my-2 px-2">
          <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[240px] md:max-w-[320px] bg-gradient-to-r from-transparent via-cyan-300 to-cyan-400 relative">
            <span className="absolute right-0 -top-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-widest text-cyan-100 uppercase shrink-0">
            {todayLabel}
          </span>
          <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[240px] md:max-w-[320px] bg-gradient-to-l from-transparent via-cyan-300 to-cyan-400 relative">
            <span className="absolute left-0 -top-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]" />
          </div>
        </div>

        {/* Small Odometer Casing */}
        <div className="odometer-casing my-2 px-5 sm:px-8 py-2 md:py-3 text-3xl sm:text-4xl md:text-5xl rounded-xl md:rounded-2xl border-3 border-slate-900/90 shadow-xl">
          {todayChars.map((char, index) => (
            <span key={`today-digit-${index}`} className="odometer-digit">
              <span key={`today-${index}-${char}`} className="odometer-digit-inner">
                {char}
              </span>
            </span>
          ))}
          {todaySuffix && (
            <span className="text-[#eee0d3] font-extrabold ml-3 sm:ml-4 text-lg sm:text-2xl md:text-3xl tracking-widest select-none">
              {todaySuffix}
            </span>
          )}
        </div>
      </div>

      {/* Section 3: Status Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3">
        {/* Soon Pill Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/90 bg-amber-950/40 text-amber-300 text-xs font-bold shadow-sm backdrop-blur-sm transition-all hover:bg-amber-950/60">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-amber-300 font-black text-xs sm:text-sm">
            {soonCount}
          </span>
          <span>{soonLabel}</span>
        </div>

        {/* Late Pill Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/90 bg-rose-950/40 text-rose-300 text-xs font-bold shadow-sm backdrop-blur-sm transition-all hover:bg-rose-950/60">
          <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
          <span className="text-rose-300 font-black text-xs sm:text-sm">
            {lateCount}
          </span>
          <span>{lateLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default BarometerHero;
