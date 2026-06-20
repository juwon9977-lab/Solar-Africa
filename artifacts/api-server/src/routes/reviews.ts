import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable, vendorsTable } from "../lib/db";
import {
  GetVendorReviewsParams,
  GetVendorReviewsResponse,
  CreateReviewParams,
  CreateReviewBody,
} from "../lib/api-zod";

const router: IRouter = Router();

router.get("/vendors/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetVendorReviewsParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.vendorId, params.data.id))
    .orderBy(reviewsTable.createdAt);

  res.json(
    GetVendorReviewsResponse.parse(
      reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
    )
  );
});

router.post("/vendors/:id/reviews", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CreateReviewParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [vendor] = await db
    .select({ id: vendorsTable.id })
    .from(vendorsTable)
    .where(eq(vendorsTable.id, params.data.id));

  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  if (parsed.data.rating < 1 || parsed.data.rating > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      vendorId: params.data.id,
      reviewerName: parsed.data.reviewerName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    })
    .returning();

  res.status(201).json({ ...review!, createdAt: review!.createdAt.toISOString() });
});

export default router;
