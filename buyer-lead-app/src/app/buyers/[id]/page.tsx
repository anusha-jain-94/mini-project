"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { buyerSchema } from "@/lib/validation/buyerSchema";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BuyerDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data, error, mutate } = useSWR(`/api/buyers/${params.id}`, fetcher);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (error) return <p>Error loading buyer</p>;
  if (!data) return <p>Loading...</p>;

  const buyer = data.buyer;
  const history = data.history;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    // convert numbers properly
    values.budgetMin = values.budgetMin ? Number(values.budgetMin) : undefined;
    values.budgetMax = values.budgetMax ? Number(values.budgetMax) : undefined;
    values.bhk = values.bhk ? Number(values.bhk) : undefined;

    // validate
    const parsed = buyerSchema.safeParse(values);
    if (!parsed.success) {
      setErrorMsg(parsed.error.errors[0].message);
      return;
    }

    setSaving(true);
    setErrorMsg("");

    const res = await fetch(`/api/buyers/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (res.status === 409) {
      setErrorMsg("⚠️ Record changed, please refresh.");
    } else if (!res.ok) {
      setErrorMsg("Failed to update buyer.");
    } else {
      await mutate(); // refresh local data
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Buyer</h1>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="updatedAt" value={buyer.updatedAt} />

        <div>
          <label>Full Name</label>
          <input
            name="fullName"
            defaultValue={buyer.fullName}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            defaultValue={buyer.email ?? ""}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            name="phone"
            defaultValue={buyer.phone}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>City</label>
          <select name="city" defaultValue={buyer.city} className="border p-2 w-full">
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Zirakpur">Zirakpur</option>
            <option value="Panchkula">Panchkula</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Property Type</label>
          <select
            name="propertyType"
            defaultValue={buyer.propertyType}
            className="border p-2 w-full"
          >
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Retail</option>
          </select>
        </div>

        <div>
          <label>BHK</label>
          <select name="bhk" defaultValue={buyer.bhk ?? ""} className="border p-2 w-full">
            <option value="">--</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="Studio">Studio</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div>
            <label>Budget Min</label>
            <input
              type="number"
              name="budgetMin"
              defaultValue={buyer.budgetMin ?? ""}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>Budget Max</label>
            <input
              type="number"
              name="budgetMax"
              defaultValue={buyer.budgetMax ?? ""}
              className="border p-2 w-full"
            />
          </div>
        </div>

        <div>
          <label>Timeline</label>
          <select name="timeline" defaultValue={buyer.timeline} className="border p-2 w-full">
            <option value="0-3m">0-3m</option>
            <option value="3-6m">3-6m</option>
            <option value=">6m">&gt;6m</option>
            <option value="Exploring">Exploring</option>
          </select>
        </div>

        <div>
          <label>Source</label>
          <select name="source" defaultValue={buyer.source} className="border p-2 w-full">
            <option>Website</option>
            <option>Referral</option>
            <option>Walk-in</option>
            <option>Call</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Status</label>
          <select name="status" defaultValue={buyer.status} className="border p-2 w-full">
            <option>New</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Visited</option>
            <option>Negotiation</option>
            <option>Converted</option>
            <option>Dropped</option>
          </select>
        </div>

        <div>
          <label>Notes</label>
          <textarea
            name="notes"
            defaultValue={buyer.notes ?? ""}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-semibold mb-2">Last 5 Changes</h2>
        <ul className="space-y-2">
          {history.slice(0, 5).map((h: any) => (
            <li key={h.id} className="text-sm border-b pb-1">
              <span className="font-medium">{h.changedBy}</span>{" "}
              updated <code>{Object.keys(h.diff).join(", ")}</code> on{" "}
              {new Date(h.changedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
