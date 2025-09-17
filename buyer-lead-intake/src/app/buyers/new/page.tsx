// src/app/buyers/new/page.tsx
"use client";

import { useState } from "react";
import { z } from "zod";

// ✅ Define schema
const buyerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]),
  bhk: z.string().optional(),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.coerce.number().nonnegative("Budget min must be >= 0"),
  budgetMax: z.coerce.number().nonnegative("Budget max must be >= 0"),
  timeline: z.enum(["0-3m", "3-6m", "6-12m", "12m+"]),
  source: z.string().optional(),
  status: z.enum(["New", "Contacted", "Interested", "Closed"]),
  notes: z.string().optional(),
});

type BuyerForm = z.infer<typeof buyerSchema>;

export default function NewBuyerPage() {
  const [form, setForm] = useState<BuyerForm>({
    fullName: "",
    email: "",
    phone: "",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "",
    purpose: "Buy",
    budgetMin: 0,
    budgetMax: 0,
    timeline: "0-3m",
    source: "",
    status: "New",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BuyerForm, string>>>(
    {}
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = buyerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BuyerForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof BuyerForm;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // ✅ Clear errors on success
    setErrors({});
    console.log("Form submitted:", result.data);

    // TODO: save to DB or API
    alert("Buyer saved successfully!");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add New Buyer</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
        {/* Full Name */}
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email ?? ""}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        {/* City */}
        <div>
          <select name="city" value={form.city} onChange={handleChange}>
            <option>Chandigarh</option>
            <option>Mohali</option>
            <option>Zirakpur</option>
            <option>Panchkula</option>
            <option>Other</option>
          </select>
          {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
        </div>

        {/* Property Type */}
        <div>
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
          >
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Retail</option>
          </select>
        </div>

        {/* BHK */}
        <input
          type="text"
          name="bhk"
          placeholder="BHK"
          value={form.bhk ?? ""}
          onChange={handleChange}
        />

        {/* Purpose */}
        <div>
          <select name="purpose" value={form.purpose} onChange={handleChange}>
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </div>

        {/* Budget Min */}
        <div>
          <input
            type="number"
            name="budgetMin"
            placeholder="Budget Min"
            value={form.budgetMin}
            onChange={handleChange}
          />
          {errors.budgetMin && <p style={{ color: "red" }}>{errors.budgetMin}</p>}
        </div>

        {/* Budget Max */}
        <div>
          <input
            type="number"
            name="budgetMax"
            placeholder="Budget Max"
            value={form.budgetMax}
            onChange={handleChange}
          />
          {errors.budgetMax && <p style={{ color: "red" }}>{errors.budgetMax}</p>}
        </div>

        {/* Timeline */}
        <div>
          <select name="timeline" value={form.timeline} onChange={handleChange}>
            <option value="0-3m">0-3m</option>
            <option value="3-6m">3-6m</option>
            <option value="6-12m">6-12m</option>
            <option value="12m+">12m+</option>
          </select>
        </div>

        {/* Source */}
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={form.source ?? ""}
          onChange={handleChange}
        />

        {/* Status */}
        <div>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>New</option>
            <option>Contacted</option>
            <option>Interested</option>
            <option>Closed</option>
          </select>
        </div>

        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes ?? ""}
          onChange={handleChange}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Buyer</button>
      </form>
    </div>
  );
}
