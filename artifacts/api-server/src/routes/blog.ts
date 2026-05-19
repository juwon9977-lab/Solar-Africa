import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsQueryParams,
  ListBlogPostsResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  CreateBlogPostBody,
  UpdateBlogPostBody,
  UpdateBlogPostParams,
  DeleteBlogPostParams,
} from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_SECRET ?? "solargy-admin-2024";

function checkAdmin(req: { headers: Record<string, string | string[] | undefined> }, res: { status: (code: number) => { json: (body: unknown) => void } }): boolean {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const query = ListBlogPostsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { tag } = query.data;

  let posts;
  if (tag) {
    posts = await db
      .select()
      .from(blogPostsTable)
      .where(sql`${tag} = ANY(${blogPostsTable.tags})`)
      .orderBy(sql`${blogPostsTable.publishedAt} DESC`);
  } else {
    posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(sql`${blogPostsTable.publishedAt} DESC`);
  }

  res.json(
    ListBlogPostsResponse.parse(
      posts.map((p) => ({ ...p, publishedAt: p.publishedAt.toISOString() }))
    )
  );
});

router.post("/blog", async (req, res): Promise<void> => {
  if (!checkAdmin(req as any, res as any)) return;

  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select({ id: blogPostsTable.id })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, parsed.data.slug));

  if (existing.length > 0) {
    res.status(400).json({ error: "A blog post with this slug already exists" });
    return;
  }

  const [post] = await db
    .insert(blogPostsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json({ ...post!, publishedAt: post!.publishedAt.toISOString() });
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const params = GetBlogPostParams.safeParse({ slug: rawSlug });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(GetBlogPostResponse.parse({ ...post, publishedAt: post.publishedAt.toISOString() }));
});

router.patch("/blog/id/:id", async (req, res): Promise<void> => {
  if (!checkAdmin(req as any, res as any)) return;

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBlogPostParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db
    .update(blogPostsTable)
    .set(parsed.data)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json({ ...post, publishedAt: post.publishedAt.toISOString() });
});

router.delete("/blog/id/:id", async (req, res): Promise<void> => {
  if (!checkAdmin(req as any, res as any)) return;

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteBlogPostParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
