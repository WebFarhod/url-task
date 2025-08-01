import rateLimit from "express-rate-limit";

export const userRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 soat
  max: 100, // har foydalanuvchi uchun 100 ta so‘rov
  keyGenerator: (req) => (req as any).user?.userId || req.ip,
  message: "Too many requests. Try again later.",
});
