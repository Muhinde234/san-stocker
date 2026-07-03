const segments = [
  { label: "In Stock",     value: 1256, pct: 53, color: "#4264FB" },
  { label: "Low Stock",    value: 456,  pct: 19, color: "#f59e0b" },
  { label: "Out of Stock", value: 233,  pct: 10, color: "#ef4444" },
  { label: "Total Items",  value: 2345, pct: 18, color: "#e2e8f0" },
];

const CX = 60, CY = 60, R = 46, r = 30;

function polarToXY(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function arc(startAngle: number, endAngle: number) {
  const p1 = polarToXY(startAngle, R);
  const p2 = polarToXY(endAngle, R);
  const p3 = polarToXY(endAngle, r);
  const p4 = polarToXY(startAngle, r);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} A${R},${R} 0 ${large} 1 ${p2.x.toFixed(2)},${p2.y.toFixed(2)} L${p3.x.toFixed(2)},${p3.y.toFixed(2)} A${r},${r} 0 ${large} 0 ${p4.x.toFixed(2)},${p4.y.toFixed(2)} Z`;
}

export function InventoryStatus() {
  let cursor = 0;
  const paths = segments.map((seg) => {
    const start = cursor;
    const sweep = (seg.pct / 100) * 360;
    cursor += sweep;
    return { ...seg, d: arc(start, cursor - 0.5) };
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(66,100,251,0.08)] ring-1 ring-[#E4E8F4]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-[#1a1d3b]">Inventory Status</p>
        <button className="text-xs font-semibold text-[#4264FB] hover:underline">View all</button>
      </div>

      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <svg viewBox="0 0 120 120" className="size-32">
            {paths.map(({ label, d, color }) => (
              <path key={label} d={d} fill={color} />
            ))}
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="#1a1d3b">
              2,345
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" fontSize="7" fill="#94a3b8">
              Total Items
            </text>
          </svg>
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          {segments.map(({ label, value, pct, color }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
                <span className="text-slate-600">{label}</span>
              </div>
              <span className="font-semibold text-[#1a1d3b]">
                {value.toLocaleString()}
                <span className="ml-1 font-normal text-slate-400">({pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
