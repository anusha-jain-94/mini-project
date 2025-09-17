import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

// Utility to build where clause for Prisma
function buildWhere(search: string, city: string, propertyType: string, status: string, timeline: string) {
  const where: any = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (city) where.city = city;
  if (propertyType) where.propertyType = propertyType;
  if (status) where.status = status;
  if (timeline) where.timeline = timeline;

  return where;
}

export default async function BuyersPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
  };
}) {
  const page = parseInt(searchParams?.page || "1", 10);
  const take = 10;
  const skip = (page - 1) * take;

  const search = searchParams?.search || "";
  const city = searchParams?.city || "";
  const propertyType = searchParams?.propertyType || "";
  const status = searchParams?.status || "";
  const timeline = searchParams?.timeline || "";

  const where = buildWhere(search, city, propertyType, status, timeline);

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  if (!buyers) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Buyer Leads</h1>

      {/* Search + Filters */}
      <form method="get" className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search name, phone, email"
          defaultValue={search}
          className="border rounded px-3 py-2"
        />

        <select name="city" defaultValue={city} className="border rounded px-3 py-2">
          <option value="">All Cities</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>

        <select name="propertyType" defaultValue={propertyType} className="border rounded px-3 py-2">
          <option value="">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>

        <select name="status" defaultValue={status} className="border rounded px-3 py-2">
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Visited">Visited</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Converted">Converted</option>
          <option value="Dropped">Dropped</option>
        </select>

        <select name="timeline" defaultValue={timeline} className="border rounded px-3 py-2">
          <option value="">All Timelines</option>
          <option value="0-3m">0-3m</option>
          <option value="3-6m">3-6m</option>
          <option value=">6m">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Apply
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Property Type</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Timeline</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Updated</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((b) => (
              <tr key={b.id} className="text-center">
                <td className="p-2 border">{b.fullName}</td>
                <td className="p-2 border">{b.phone}</td>
                <td className="p-2 border">{b.city}</td>
                <td className="p-2 border">{b.propertyType}</td>
                <td className="p-2 border">
                  {b.budgetMin || "—"} - {b.budgetMax || "—"}
                </td>
                <td className="p-2 border">{b.timeline}</td>
                <td className="p-2 border">{b.status}</td>
                <td className="p-2 border">
                  {new Date(b.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/buyers/${b.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View / Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Link
            key={i}
            href={{
              pathname: "/buyers",
              query: { ...searchParams, page: i + 1 },
            }}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
