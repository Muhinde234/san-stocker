"use client";

import { useState } from "react";

import { Pagination } from "@/components/ui/pagination";

const orders = [
  { id: "#ORD-250531", customer: "James Mwangi",  date: "31 May 2025", amount: "RWF 45,678",  status: "Completed",  payment: "Paid"   },
  { id: "#ORD-250530", customer: "Grace Wanjiku",  date: "30 May 2025", amount: "RWF 78,900",  status: "Processing", payment: "Paid"   },
  { id: "#ORD-250529", customer: "David Ochieng",  date: "29 May 2025", amount: "RWF 23,400",  status: "Completed",  payment: "Paid"   },
  { id: "#ORD-250528", customer: "Mary Atieno",    date: "28 May 2025", amount: "RWF 67,800",  status: "Pending",    payment: "Unpaid" },
  { id: "#ORD-250527", customer: "Peter Mutua",    date: "27 May 2025", amount: "RWF 12,300",  status: "Completed",  payment: "Paid"   },
  { id: "#ORD-250526", customer: "Amina Hassan",    date: "26 May 2025", amount: "RWF 51,200",  status: "Completed",  payment: "Paid"   },
  { id: "#ORD-250525", customer: "Brian Kato",      date: "25 May 2025", amount: "RWF 17,450",  status: "Processing", payment: "Paid"   },
];

const statusStyle: Record<string, string> = {
  Completed:  "bg-emerald-50 text-emerald-700",
  Processing: "bg-[#EEF1FF] text-[#4264FB]",
  Pending:    "bg-amber-50 text-amber-600",
};

const payStyle: Record<string, string> = {
  Paid:   "bg-emerald-50 text-emerald-700",
  Unpaid: "bg-red-50 text-red-600",
};

export function RecentOrders() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const visibleOrders = orders.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="rounded-2xl bg-white shadow-[0_2px_16px_rgba(66,100,251,0.08)] ring-1 ring-[#E4E8F4]">
      <div className="flex items-center justify-between border-b border-[#E4E8F4] px-6 py-4">
        <p className="text-sm font-bold text-[#1a1d3b]">Recent Orders</p>
        <button className="text-xs font-semibold text-[#4264FB] hover:underline">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#E4E8F4] text-left">
              {["Order ID", "Customer", "Date", "Amount", "Status", "Payment"].map((h) => (
                <th key={h} className="px-5 py-3 font-semibold text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((o, i) => (
              <tr
                key={o.id}
                className={`border-b border-[#F0F3FB] transition-colors hover:bg-[#F8F9FF] ${
                  i === visibleOrders.length - 1 ? "border-0" : ""
                }`}
              >
                <td className="px-5 py-3.5 font-semibold text-[#4264FB]">{o.id}</td>
                <td className="px-5 py-3.5 font-medium text-[#1a1d3b]">{o.customer}</td>
                <td className="px-5 py-3.5 text-slate-400">{o.date}</td>
                <td className="px-5 py-3.5 font-semibold text-[#1a1d3b]">{o.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${payStyle[o.payment]}`}>
                    {o.payment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
