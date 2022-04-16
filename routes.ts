import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

// Global error checker
export const use =
  (check: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(check(req, res, next)).catch(next);
  };

router.post(
  "/",
  use((_: Request, res: Response) => {
    return res.json({ message: "Server is OK" });
  })
);

export default router;
