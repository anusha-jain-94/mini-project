"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Followup = { id: number; date: string; note: string };
type Change = {
  id: number;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
};
type Buyer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  source?: string;
  budget?: string;
  notes?: string;
  status: string;
  timeline?: string;
  updatedAt: string;
  followups: Followup[];
  changes: Change[];
};

export default function BuyerDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [buyer, setBuyer] = useState<Buyer | null>(null);

  useEffect(() => {
    fetch(`/api/buyers/${id}`)
      .then((res) => res.json())
      .then((data) => setBuyer(data));
  }, [id]);

  if (!buyer) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{buyer.name}</h1>
      <p>Email: {buyer.email}</p>
      <p>Phone: {buyer.phone}</p>
      <p>Source: {buyer.source}</p>
      <p>Budget: {buyer.budget}</p>
      <p>Status: {buyer.status}</p>
      <p>Timeline: {buyer.timeline}</p>
      <p className="mt-2">Notes: {buyer.notes}</p>

      {/* Followups */}
      <h2 className="text-xl mt-6 mb-2 font-semibold">Follow-ups</h2>
      <ul className="list-disc ml-5">
        {buyer.followups.map((f) => (
          <li key={f.id}>
            {new Date(f.date).toLocaleDateString("en-IN")}: {f.note}
          </li>
        ))}
      </ul>

      {/* Changes */}
      <h2 className="text-xl mt-6 mb-2 font-semibold">Recent Changes</h2>
      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Field</th>
            <th className="border px-2 py-1">Old → New</th>
            <th className="border px-2 py-1">By</th>
            <th className="border px-2 py-1">At</th>
          </tr>
        </thead>
        <tbody>
          {buyer.changes.slice(-5).reverse().map((c) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.field}</td>
              <td className="border px-2 py-1">
                {c.oldValue} → {c.newValue}
              </td>
              <td className="border px-2 py-1">{c.changedBy}</td>
              <td className="border px-2 py-1">
                {new Date(c.changedAt).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
