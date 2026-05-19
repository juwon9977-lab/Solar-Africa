import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, vendorsTable } from "@workspace/db";
import {
  AdminVerifyVendorParams,
  AdminFeatureVendorParams,
  AdminDeleteVendorParams,
  AdminLoginBody,
  AdminLoginResponse,
  AdminVerifyVendorResponse,
  AdminFeatureVendorResponse,
} from "@workspace/api-zod";

const ADMIN_KEY = process.env.ADMIN_SECRET ?? "solargy-admin-2024";

function checkAdmin(
  req: { headers: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: unknown) => void } }
): boolean {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.key !== ADMIN_KEY) {
    res.status(401).json({ error: "Invalid admin key" });
    return;
  }

  res.json(AdminLoginResponse.parse({ success: true, token: parsed.data.key }));
});

router.patch("/admin/vendors/:id/verify", async (req, res): Promise<void> => {
  if (!checkAdmin(req as any, res as any)) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminVerifyVendorParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(vendorsTable)
    .where(eq(vendorsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  const [vendor] = await db
    .update(vendorsTable)
    .set({ verified: !existing.verified })
    .where(eq(vendorsTable.id, params.data.id))
    .returning();

  res.json(
    AdminVerifyVendorResponse.parse({
      ...vendor!,
      rating: null,
      reviewCount: 0,
      createdAt: vendor!.createdAt.toISOString(),
    })
  );
});

router.patch("/admin/vendors/:id/feature", async (req, res): Promise<void> => {
  if (!checkAdmin(req as any, res as any)) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminFeatureVendorParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(vendorsTable)
    .where(eq(vendorsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  const [vendor] = await db
    .update(vendorsTable)
    .set({ featured: !existing.featured })
    .where(eq(vendorsTable.id, params.data.id))
    .returning();

  res.json(
    AdminFeatureVendorResponse.parse({
      ...vendor!,
      rating: null,
      reviewCount: 0,
      createdAt: vendor!.createdAt.toISOString(),
    })
  );
});

router.delete("/admin/vendors/:id", async (req, res): Promise<void> => {
  if (!checkAdmin(req as any, res as any)) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminDeleteVendorParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [vendor] = await db
    .delete(vendorsTable)
    .where(eq(vendorsTable.id, params.data.id))
    .returning();

  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
