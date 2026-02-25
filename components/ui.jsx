"use client";
import React from "react";
import { BRAND_COLORS, MOUSE_IMAGE_URLS, mice, icon, I, amazonLink, flagUrl } from "@/data";

export const Flag = ({ country, size = 20, className = "" }) => {
  const url = flagUrl(country, size * 2);
  if (!url) return <span className={className}>{country}</span>;
  return <img loading="lazy" src={url} alt={country} width={size} height={Math.round(size * 0.75)} className={className} style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 2, objectFit: "cover" }} />;
};

export const GlowText = ({ children, color = "#00ff6a", size = "text-5xl", className = "" }) => (
  <span className={`${size} font-black tracking-tight ${className}`} style={{
    color,
    textShadow: `0 0 20px ${color}40, 0 0 60px ${color}20`,
  }}>{children}</span>
);

export const StatBox = ({ label, value, unit = "", color = "#00ff6a" }) => (
  <div className="flex flex-col items-center justify-center text-center p-2 sm:p-4 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
    <div className="text-xl sm:text-3xl font-black" style={{ color }}>{value}<span className="text-sm sm:text-lg opacity-70">{unit}</span></div>
    <div className="text-sm uppercase tracking-widest mt-1 opacity-50">{label}</div>
  </div>
);

export const SectionTitle = ({ children, sub, color = "#00ff6a" }) => (
  <div className="mb-4 sm:mb-8 mt-8 sm:mt-16">
    <div className="flex items-center gap-2 sm:gap-3 mb-2">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
      <h2 className="text-lg sm:text-2xl lg:text-3xl font-black uppercase tracking-wide text-center" style={{ color }}>{children}</h2>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${color}, transparent)` }} />
    </div>
    {sub && <p className="text-center text-sm sm:text-sm opacity-85 tracking-wide px-2">{sub}</p>}
  </div>
);

export const MouseCard = ({ mouse, onClick, isSelected, rank }) => {
  const brandCol = BRAND_COLORS[mouse.brand] || "#888";
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      onClick={() => onClick?.(mouse)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer rounded-xl p-3 transition-all duration-300 group flex flex-col w-full"
      style={{
        background: isSelected ? `${brandCol}15` : isHovered ? `${brandCol}08` : `linear-gradient(135deg, #0d0d0d, #1a1a1a)`,
        border: isSelected ? `2px solid ${brandCol}` : isHovered ? `1px solid ${brandCol}40` : `1px solid #ffffff10`,
        transform: isSelected ? "scale(1.02)" : isHovered ? "scale(1.03)" : "scale(1)",
        boxShadow: isSelected
          ? `0 0 40px ${brandCol}20`
          : isHovered
          ? `0 0 25px ${brandCol}18, 0 0 50px ${brandCol}08, inset 0 0 30px ${brandCol}05`
          : "none",
      }}
    >
      <div className="absolute top-2 right-2 text-sm font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${brandCol}20`, color: brandCol, fontSize: 11 }}>
        #{rank || mice.indexOf(mouse) + 1}
      </div>
      <div className="mb-2 h-14 flex items-center justify-center">
        {MOUSE_IMAGE_URLS[mouse.name] && (
          <img loading="lazy" src={MOUSE_IMAGE_URLS[mouse.name]}
            alt={`${mouse.name} ${mouse.brand} esports gaming mouse`} className="w-full h-full object-contain object-center" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }} />
        )}
      </div>
      <div className="mb-0.5 overflow-hidden">
        <div className="text-sm sm:text-sm font-bold leading-tight" style={{ color: brandCol, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{mouse.name}</div>
      </div>
      <div className="text-sm opacity-85 mb-2" style={{ fontSize: 13 }}>{mouse.brand}</div>
      <div className="grid grid-cols-2 gap-1.5 text-sm mt-auto" style={{ fontSize: 13 }}>
        <div className="flex justify-between"><span className="opacity-85">Weight</span><span className="font-bold">{mouse.weight}g</span></div>
        <div className="flex justify-between"><span className="opacity-85">Poll</span><span className="font-bold">{mouse.pollingRate >= 1000 ? `${mouse.pollingRate / 1000}K` : mouse.pollingRate}Hz</span></div>
        <div className="flex justify-between"><span className="opacity-85">Price</span><span className="font-bold">{"$"}{mouse.price}</span></div>
        <div className="flex justify-between"><span className="opacity-85">Pro %</span><span className="font-bold" style={{ color: brandCol }}>{mouse.proUsage}%</span></div>
      </div>
      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${mouse.rating * 10}%`, background: `linear-gradient(to right, ${brandCol}80, ${brandCol})` }} />
      </div>
      <div className="text-right mt-0.5 opacity-85" style={{ fontSize: 12 }}>{mouse.rating}/10</div>
      <a href={amazonLink(mouse.name)} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-bold transition-all opacity-60 group-hover:opacity-100 hover:!opacity-100"
        style={{ background: `${brandCol}15`, color: brandCol, border: `1px solid ${brandCol}25`, fontSize: 13 }}
        onMouseEnter={e => { e.currentTarget.style.background = brandCol; e.currentTarget.style.color = "#000"; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${brandCol}15`; e.currentTarget.style.color = brandCol; }}>
        {I.cart(12)} {"$"}{mouse.price} — Buy on Amazon
      </a>
    </div>
  );
};

export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm" style={{ background: "#0a0a0aee", border: "1px solid #ffffff15" }}>
      <div className="font-bold mb-1 opacity-60">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="opacity-50">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{typeof p.value === 'number' && p.name?.toLowerCase().includes('usage') ? `${p.value}%` : p.value}</span>
        </div>
      ))}
    </div>
  );
};
