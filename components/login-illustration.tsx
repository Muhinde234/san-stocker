import { Box } from "lucide-react";

function Leaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" className={className} fill="none">
      <rect x="36" y="188" width="48" height="38" rx="6" fill="#16205e" />
      <rect x="42" y="176" width="36" height="18" rx="4" fill="#1862e9" />
      <path
        d="M60 188c0-54-34-76-50-84 6 30 10 70 50 84Z"
        fill="#1862e9"
        opacity="0.5"
      />
      <path
        d="M60 188c0-66 24-94 40-104-2 34-2 84-40 104Z"
        fill="#1862e9"
        opacity="0.8"
      />
      <path d="M60 188c0-44-16-62-26-70 4 24 6 54 26 70Z" fill="#3b82f6" />
      <path d="M60 188c0-50 18-72 30-82-2 26-4 60-30 82Z" fill="#1862e9" />
      <path d="M60 188c0-30-9-45-15-52 3 17 4 38 15 52Z" fill="#5b9dff" />
      <path d="M60 188c0-34 10-50 18-58-2 18-3 41-18 58Z" fill="#2f6fe0" />
    </svg>
  );
}

function AccentLeaf({
  className,
  fill = "#3b82f6",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <path
        d="M20 4c8 4 14 12 14 20-8 0-16-6-20-14-2-4-2-4 6-6Z"
        fill={fill}
      />
    </svg>
  );
}

function PersonIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} fill="none">
      <ellipse cx="100" cy="246" rx="62" ry="10" fill="#000000" opacity="0.12" />
      <rect x="35" y="195" width="38" height="52" rx="10" fill="#0a1142" />
      <rect x="127" y="195" width="38" height="52" rx="10" fill="#0a1142" />
      <rect x="30" y="232" width="46" height="20" rx="10" fill="#1862e9" />
      <rect x="124" y="232" width="46" height="20" rx="10" fill="#1862e9" />
      <rect x="32" y="244" width="42" height="5" rx="2.5" fill="#bfe0ff" />
      <rect x="126" y="244" width="42" height="5" rx="2.5" fill="#bfe0ff" />
      <path
        d="M58 130h84c8 0 14 6 14 14v50c0 8-6 14-14 14H58c-8 0-14-6-14-14v-50c0-8 6-14 14-14Z"
        fill="#0a1142"
      />
      <path
        d="M64 70h72c10 0 18 8 18 18v60c0 10-8 18-18 18H64c-10 0-18-8-18-18V88c0-10 8-18 18-18Z"
        fill="#ffffff"
      />
      <path d="M100 70v36l-14-16h28l-14 16Z" fill="#ffffff" />
      <path d="M92 70h16l-8 24-8-24Z" fill="#1862e9" />
      <rect x="96" y="92" width="8" height="46" rx="3" fill="#1862e9" />
      <path
        d="M58 80c-10 6-16 18-16 34v30c0 8 6 14 14 14h6V80h-4Z"
        fill="#ffffff"
      />
      <path
        d="M142 80c10 6 16 18 16 34v30c0 8-6 14-14 14h-6V80h4Z"
        fill="#ffffff"
      />
      <rect x="44" y="144" width="22" height="34" rx="8" fill="#fbc8a0" />
      <rect x="134" y="144" width="22" height="34" rx="8" fill="#fbc8a0" />
      <rect x="78" y="150" width="44" height="34" rx="6" fill="#0a1142" />
      <circle cx="100" cy="38" r="30" fill="#fbc8a0" />
      <path
        d="M68 34c0-22 14-36 32-36s32 14 32 36c0-3-7-12-32-12s-32 9-32 12Z"
        fill="#16213d"
      />
      <path d="M98 4c1 6 0 11-4 14 3-1 6-1 8 0-2-5-3-9-4-14Z" fill="#16213d" />
    </svg>
  );
}

export function ProfileBust({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <circle cx="40" cy="40" r="40" fill="#e8f0fe" />
      <path
        d="M40 60c-12 0-22 6-22 14v6h44v-6c0-8-10-14-22-14Z"
        fill="#1862e9"
      />
      <circle cx="40" cy="34" r="16" fill="#fbc8a0" />
      <path
        d="M24 32c0-11 7-19 16-19s16 8 16 19c0-2-4-6-16-6s-16 4-16 6Z"
        fill="#16213d"
      />
    </svg>
  );
}

function NavyWave() {
  return (
    <svg
      viewBox="0 0 300 1200"
      preserveAspectRatio="none"
      className="absolute inset-y-0 left-0 h-full w-[112%]"
    >
      <defs>
        <linearGradient id="navyWaveGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#161f6e" />
          <stop offset="45%" stopColor="#0d1450" />
          <stop offset="100%" stopColor="#04061f" />
        </linearGradient>
        <linearGradient id="navyWaveSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,0 L0,1200 L255,1200
           C280,1100 280,1020 255,940
           C228,855 228,790 258,700
           C285,595 285,545 258,460
           C230,395 228,330 255,260
           C280,180 280,90 255,0
           Z"
        fill="url(#navyWaveGrad)"
      />
      <path
        d="M0,0 L0,1200 L255,1200
           C280,1100 280,1020 255,940
           C228,855 228,790 258,700
           C285,595 285,545 258,460
           C230,395 228,330 255,260
           C280,180 280,90 255,0
           Z"
        fill="url(#navyWaveSheen)"
      />
    </svg>
  );
}

function InnerBlob() {
  return (
    <svg
      viewBox="0 0 300 1200"
      preserveAspectRatio="none"
      className="absolute inset-y-0 left-0 h-full w-[112%]"
    >
      <defs>
        <linearGradient id="innerBlobGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#222f8e" />
          <stop offset="55%" stopColor="#161f6e" />
          <stop offset="100%" stopColor="#0d1450" />
        </linearGradient>
      </defs>
      <path
        d="M160,70
           C230,60 270,140 255,220
           C240,300 175,340 195,420
           C215,500 270,540 260,620
           C250,700 220,760 190,850
           C160,930 90,920 70,880
           C40,830 50,720 35,650
           C20,580 45,450 55,350
           C65,250 90,80 160,70
           Z"
        fill="url(#innerBlobGrad)"
      />
    </svg>
  );
}

export function LoginIllustration() {
  return (
    <div className="relative hidden h-full overflow-visible lg:block">
      <NavyWave />
      <InnerBlob />

      <AccentLeaf
        className="absolute left-[68%] top-[15%] h-9 w-9 -rotate-[20deg] opacity-90"
        fill="#0a1142"
      />
      <AccentLeaf
        className="absolute left-[74%] top-[24%] h-7 w-7 rotate-[10deg] opacity-80"
        fill="#3b82f6"
      />
      <AccentLeaf
        className="absolute left-[80%] top-[75%] h-6 w-6 rotate-[100deg] opacity-70"
        fill="#3b82f6"
      />

      <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col items-center justify-center">
        <Leaves className="absolute bottom-6 left-1 h-40 w-24 opacity-90" />

        <div
          className="absolute h-12 w-48 rounded-[50%] bg-black/55 blur-xl"
          style={{ top: "calc(50% + 14.5rem)" }}
        />

        <div style={{ perspective: "1400px" }}>
          <div className="relative" style={{ transform: "rotateY(-6deg) rotateX(1.5deg)" }}>
            <span className="absolute -left-[3px] top-20 h-6 w-1 rounded-l-sm bg-slate-300/90" />
            <span className="absolute -left-[3px] top-28 h-10 w-1 rounded-l-sm bg-slate-300/90" />
            <span className="absolute -right-[3px] top-24 h-14 w-1 rounded-r-sm bg-slate-300/90" />

            <div
              className="relative z-10 flex h-112 w-60 flex-col items-center overflow-hidden rounded-[2.5rem] border-[6px] border-slate-200/90 shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #5b9dff 0%, #2f7dfb 38%, #1862e9 65%, #0a3fb0 100%)",
                boxShadow:
                  "12px 22px 40px -8px rgba(4,6,31,0.65), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/25" />
              <div className="pointer-events-none absolute -left-6 top-0 h-full w-10 bg-linear-to-r from-white/25 to-transparent blur-sm" />

              <div className="mt-3.5 h-1.5 w-14 rounded-full bg-black/20" />

              <div className="mt-8 flex flex-col items-center gap-2.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-[0_3px_0_rgba(0,0,0,0.15),0_8px_14px_rgba(0,0,0,0.28)]">
                  <Box className="size-6 text-brand-blue" strokeWidth={2} />
                </div>
                <p className="text-base text-white drop-shadow-sm">
                  <span className="font-extrabold">SAN</span>{" "}
                  <span className="font-medium">Stocker</span>
                </p>
              </div>

              <PersonIllustration className="mt-auto h-52 w-52" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
