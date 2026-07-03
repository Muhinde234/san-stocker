// Sales data (RWF thousands) for Mon–Sun
const salesData = [800, 1200, 950, 1550, 2050, 1800, 2400];
const weekDays  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX = 2400;

const W = 560, H = 180, PL = 40, PT = 20, PB = 30;
const CW = W - PL;
const CH = H - PT - PB;

const pts = salesData.map((v, i) => ({
  x: PL + (i / (salesData.length - 1)) * CW,
  y: PT + (1 - v / MAX) * CH,
}));

function smooth(points: { x: number; y: number }[]) {
  return points
    .map((p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = points[i - 1];
      const mx = (prev.x + p.x) / 2;
      return `C ${mx},${prev.y} ${mx},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");
}

const linePath = smooth(pts);
const last = pts[pts.length - 1];
const first = pts[0];
const areaPath = `${linePath} L ${last.x},${H - PB} L ${first.x},${H - PB} Z`;

const orders = [
  { time: "10:00 AM", id: "#ORD-250531", customer: "James Mwangi",  dot: "bg-[#4264FB]"    },
  { time: "11:30 AM", id: "#ORD-250530", customer: "Grace Wanjiku",  dot: "bg-emerald-500"  },
  { time: "2:00 PM",  id: "#ORD-250529", customer: "David Ochieng",  dot: "bg-emerald-500"  },
  { time: "3:30 PM",  id: "#ORD-250528", customer: "Mary Atieno",    dot: "bg-amber-400"    },
];

export function SalesTrendChart() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E4E8F4]">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-[#1a1d3b]">Sales Trend</p>
          <p className="text-xs text-slate-400">Average daily sales</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-[#1a1d3b]">RWF 2.4M</p>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            This Week
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4264FB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4264FB" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PL} y1={PT + t * CH}
            x2={W}  y2={PT + t * CH}
            stroke="#E4E8F4" strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#4264FB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#4264FB" strokeWidth="2" />
        ))}

        {/* X-axis labels */}
        {weekDays.map((d, i) => (
          <text key={d} x={pts[i].x} y={H - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {d}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function TodaysOrders() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E4E8F4]">
      <div className="mb-5">
        <p className="text-sm font-bold text-[#1a1d3b]">Orders</p>
        <p className="text-xs text-slate-400">Today</p>
      </div>

      <div className="space-y-5">
        {orders.map(({ time, id, customer, dot }) => (
          <div key={id} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-[11px] tabular-nums text-slate-400">{time}</span>
            <span className={`size-2 shrink-0 rounded-full ${dot}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#1a1d3b]">{customer}</p>
              <p className="text-[10px] text-slate-400">{id}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 text-xs font-semibold text-[#4264FB] hover:underline">
        View all orders
      </button>
    </div>
  );
}
