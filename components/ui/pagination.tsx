"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function buildPages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex size-7 items-center justify-center rounded-lg border border-[#E4E8F4] text-slate-400 transition-colors hover:bg-[#F4F6FC] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-3.5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`flex size-7 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
            page === currentPage
              ? "bg-[#4264FB] text-white shadow-[0_2px_8px_rgba(66,100,251,0.35)]"
              : "border border-[#E4E8F4] text-slate-500 hover:bg-[#F4F6FC]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex size-7 items-center justify-center rounded-lg border border-[#E4E8F4] text-slate-400 transition-colors hover:bg-[#F4F6FC] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}