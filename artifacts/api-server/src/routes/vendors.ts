import { Router, type IRouter } from "express";
import { eq, ilike, and, sql, avg, count } from "drizzle-orm";
import { db, vendorsTable, reviewsTable } from "../lib/db";
import {
  ListVendorsQueryParams,
  ListVendorsResponse,
  GetVendorParams,
  GetVendorResponse,
  GetVendorStatsResponse,
  CreateVendorBody,
} from "../lib/api-zod";

const router: IRouter = Router();

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

router.get("/vendors/stats", async (req, res): Promise<void> => {
  const [totalRow] = await db
    .select({ total: count(vendorsTable.id) })
    .from(vendorsTable);
  const [verifiedRow] = await db
    .select({ total: count(vendorsTable.id) })
    .from(vendorsTable)
    .where(eq(vendorsTable.verified, true));
  const [reviewRow] = await db
    .select({ total: count(reviewsTable.id) })
    .from(reviewsTable);

  const stateRows = await db
    .select({ state: vendorsTable.state })
    .from(vendorsTable)
    .groupBy(vendorsTable.state);

  const categoryRows = await db
    .select({
      category: vendorsTable.category,
      count: count(vendorsTable.id),
    })
    .from(vendorsTable)
    .groupBy(vendorsTable.category);

  const stateCountRows = await db
    .select({
      state: vendorsTable.state,
      count: count(vendorsTable.id),
    })
    .from(vendorsTable)
    .groupBy(vendorsTable.state);

  res.json(
    GetVendorStatsResponse.parse({
      totalVendors: totalRow?.total ?? 0,
      verifiedVendors: verifiedRow?.total ?? 0,
      statesCovered: stateRows.length,
      totalReviews: reviewRow?.total ?? 0,
      categoryCounts: categoryRows.map((r) => ({
        category: r.category,
        count: Number(r.count),
      })),
      stateCounts: stateCountRows.map((r) => ({
        state: r.state,
        count: Number(r.count),
      })),
    })
  );
});

router.get("/vendors", async (req, res): Promise<void> => {
  const query = ListVendorsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { state, category, q, featured, verified } = query.data;

  const conditions = [];
  if (state) conditions.push(eq(vendorsTable.state, state));
  if (category) conditions.push(eq(vendorsTable.category, category));
  if (q) {
    conditions.push(
      sql`(${ilike(vendorsTable.name, `%${q}%`)} OR ${ilike(vendorsTable.description, `%${q}%`)} OR ${ilike(vendorsTable.services, `%${q}%`)})`
    );
  }
  if (featured !== undefined) conditions.push(eq(vendorsTable.featured, featured));
  if (verified !== undefined) conditions.push(eq(vendorsTable.verified, verified));

  const vendors = await db
    .select()
    .from(vendorsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(sql`${vendorsTable.featured} DESC, ${vendorsTable.createdAt} DESC`);

  const vendorIds = vendors.map((v) => v.id);
  const reviewStats =
    vendorIds.length > 0
      ? await db
          .select({
            vendorId: reviewsTable.vendorId,
            avgRating: avg(reviewsTable.rating),
            reviewCount: count(reviewsTable.id),
          })
          .from(reviewsTable)
          .where(sql`${reviewsTable.vendorId} = ANY(${sql`ARRAY[${sql.join(vendorIds.map((id) => sql`${id}`), sql`, `)}]::int[]`})`)
          .groupBy(reviewsTable.vendorId)
      : [];

  const statsMap = new Map(
    reviewStats.map((r) => [r.vendorId, r])
  );

  const result = vendors.map((v) => ({
    ...v,
    rating: statsMap.get(v.id)?.avgRating
      ? parseFloat(String(statsMap.get(v.id)!.avgRating!))
      : null,
    reviewCount: Number(statsMap.get(v.id)?.reviewCount ?? 0),
    createdAt: v.createdAt.toISOString(),
  }));

  res.json(ListVendorsResponse.parse(result));
});

router.get("/vendors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetVendorParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [vendor] = await db
    .select()
    .from(vendorsTable)
    .where(eq(vendorsTable.id, params.data.id));

  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  const [reviewStat] = await db
    .select({
      avgRating: avg(reviewsTable.rating),
      reviewCount: count(reviewsTable.id),
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.vendorId, params.data.id));

  res.json(
    GetVendorResponse.parse({
      ...vendor,
      rating: reviewStat?.avgRating
        ? parseFloat(String(reviewStat.avgRating))
        : null,
      reviewCount: Number(reviewStat?.reviewCount ?? 0),
      createdAt: vendor.createdAt.toISOString(),
    })
  );
});

router.post("/vendors", async (req, res): Promise<void> => {
  const parsed = CreateVendorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const logo = getInitials(parsed.data.name);

  const [vendor] = await db
    .insert(vendorsTable)
    .values({ ...parsed.data, logo })
    .returning();

  res.status(201).json({
    ...vendor,
    rating: null,
    reviewCount: 0,
    createdAt: vendor!.createdAt.toISOString(),
  });
});

export default router;
