"use client";

import { useState, useEffect} from "react";
import Link from "next/link";
import { buyers as initialBuyers } from "@/lib/fakeDB";
import { Buyer } from "@/lib/types";

export default function BuyersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [clientDates, setClientDates] = useState<Record<string, string>>({});
  const filtered = initialBuyers.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.fullName.toLowerCase().includes(q) ||
      (b.email ?? "").toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

   useEffect(() => {
  const dates: Record<string, string> = {};
  initialBuyers.forEach((b) => {
    dates[b.id] = new Date(b.updatedAt).toLocaleString('en-IN');
  });
  setClientDates(dates);
}, []); 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buyers</h1>

      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search buyers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-1/2"
        />
        <Link
          href="/buyers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Buyer
        </Link>
      </div>

      <table className="border-collapse w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">City</th>
            <th className="border px-2 py-1">PropertyType</th>
            <th className="border px-2 py-1">Budget(min-max)</th>
            <th className="border px-2 py-1">timeline</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">UpdatedAt</th>
            <th className="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">
                  <Link href={`/buyers/${buyer.id}`} className="text-blue-600">
                    {buyer.fullName}
                  </Link>
                </td>
                <td className="border px-2 py-1">{buyer.phone}</td>
                <td className="border px-2 py-1">{buyer.city}</td>
                <td className="border px-2 py-1">{buyer.propertyType}</td>
                <td className="border px-2 py-1"> {buyer.budgetMin || buyer.budgetMax
                ? `${buyer.budgetMin?.toLocaleString() ?? "—"} - ${buyer.budgetMax?.toLocaleString() ?? "—"}`
                : "—"}</td>
                <td className="border px-2 py-1">{buyer.timeline}</td>
                <td className="border px-2 py-1">{buyer.status}</td>
                <td className="border px-2 py-1"> {clientDates[buyer.id] ?? '...'}</td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View/edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4">
                No buyers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
