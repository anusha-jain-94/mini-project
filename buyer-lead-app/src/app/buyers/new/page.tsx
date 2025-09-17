"use client";

import { useForm, SubmitHandler  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { buyerSchema } from "@/lib/validation";
import { z } from "zod";
import { City, PropertyType, Purpose, Timeline, Source, BHK } from "@prisma/client";

type BuyerFormData = z.infer<typeof buyerSchema>;

export default function NewBuyerPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
    status: "NEW",   // match the schema defaults
    source: "OTHER",
    timeline: "EXPLORING",
  }
  });

  const propertyType = watch("propertyType");

  const onSubmit: SubmitHandler<BuyerFormData> = async (data)  => {
    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to create lead");
        return;
      }

      setSuccess("Lead created successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Lead</h1>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Full Name*</label>
          <input {...register("fullName")} className="input" />
          {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input {...register("email")} className="input" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone*</label>
          <input {...register("phone")} className="input" />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label>City*</label>
          <select {...register("city")} className="input">
            <option value="">Select</option>
            {Object.values(City).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </div>

        <div>
          <label>Property Type*</label>
          <select {...register("propertyType")} className="input">
            <option value="">Select</option>
            {Object.values(PropertyType).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.propertyType && <p className="text-red-500">{errors.propertyType.message}</p>}
        </div>

        {(propertyType === "APARTMENT" || propertyType === "VILLA") && (
          <div>
            <label>BHK*</label>
            <select {...register("bhk")} className="input">
              <option value="">Select</option>
              {Object.values(BHK).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.bhk && <p className="text-red-500">{errors.bhk.message}</p>}
          </div>
        )}

        <div>
          <label>Purpose*</label>
          <select {...register("purpose")} className="input">
            <option value="">Select</option>
            {Object.values(Purpose).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.purpose && <p className="text-red-500">{errors.purpose.message}</p>}
        </div>

        <div>
          <label>Budget Min</label>
          <input type="number" {...register("budgetMin", { valueAsNumber: true })} className="input" />
        </div>

        <div>
          <label>Budget Max</label>
          <input type="number" {...register("budgetMax", { valueAsNumber: true })} className="input" />
          {errors.budgetMax && <p className="text-red-500">{errors.budgetMax.message}</p>}
        </div>

        <div>
          <label>Timeline*</label>
          <select {...register("timeline")} className="input">
            <option value="">Select</option>
            {Object.values(Timeline).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.timeline && <p className="text-red-500">{errors.timeline.message}</p>}
        </div>

        <div>
          <label>Source*</label>
          <select {...register("source")} className="input">
            <option value="">Select</option>
            {Object.values(Source).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.source && <p className="text-red-500">{errors.source.message}</p>}
        </div>

        <div>
          <label>Notes</label>
          <textarea {...register("notes")} className="input" />
        </div>

        <div>
          <label>Tags (comma separated)</label>
          <input
            {...register("tags", {
              setValueAs: v => v ? v.split(",").map((t: string) => t.trim()) : [],
            })}
            className="input"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Lead
        </button>
      </form>
    </div>
  );
}
