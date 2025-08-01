/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: URL Shortener endpoints
 */

import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import urlController from "../controllers/url.controller";
import { userRateLimiter } from "../middlewares/rateRateLimiter.middleware";

const router = Router();

/**
 * @swagger
 * /urls/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://example.com
 *               expiresIn:
 *                 type: number
 *                 description: Expiration time in seconds (optional)
 *     responses:
 *       200:
 *         description: Short URL created
 */
router.post(
  "/shorten",
  AuthMiddleware,
  userRateLimiter,
  urlController.shortenUrl
);

/**
 * @swagger
 * /urls/stats/{shortCode}:
 *   get:
 *     summary: Get statistics for a short URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The short code
 *     responses:
 *       200:
 *         description: URL statistics
 */
router.get(
  "/stats/:shortCode",
  AuthMiddleware,
  userRateLimiter,
  urlController.getStats
);

/**
 * @swagger
 * /urls/{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The short code
 *     responses:
 *       302:
 *         description: Redirect to original URL
 */
router.get("/:shortCode", userRateLimiter, urlController.redirectUrl);

export default router;
