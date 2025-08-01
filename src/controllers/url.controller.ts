import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import AuthService from "../services/auth.service";
import { AuthDto } from "../validators/auth.validator";
import BaseError from "../utils/base.error";
import { handleValidationErrors } from "../validators/format";
import { UrlDto } from "../validators/url.validator";
import urlService from "../services/url.service";

class UrlController {
  async shortenUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const urlDto = plainToInstance(UrlDto, req.body);
      const errors = await validate(urlDto);

      if (errors.length > 0) {
        const formattedErrors = handleValidationErrors(errors);
        return next(BaseError.BadRequest("Validation error", formattedErrors));
      }

      const data = await urlService.shortenUrl(urlDto, user);

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;
      const user = req.user;

      const data = await urlService.getStats(shortCode, user);

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async redirectUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;

      const data = await urlService.redirectUrl(shortCode);
      res.redirect(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new UrlController();
