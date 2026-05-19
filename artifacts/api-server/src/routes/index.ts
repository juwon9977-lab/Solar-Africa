import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vendorsRouter from "./vendors";
import reviewsRouter from "./reviews";
import blogRouter from "./blog";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vendorsRouter);
router.use(reviewsRouter);
router.use(blogRouter);
router.use(adminRouter);

export default router;
