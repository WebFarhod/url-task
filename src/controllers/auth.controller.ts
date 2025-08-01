import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import AuthService from "../services/auth.service";
import { AuthDto } from "../validators/auth.validator";
import BaseError from "../utils/base.error";
import { handleValidationErrors } from "../validators/format";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userDto = plainToInstance(AuthDto, req.body);
      const errors = await validate(userDto);

      if (errors.length > 0) {
        const formattedErrors = handleValidationErrors(errors);
        return next(BaseError.BadRequest("Validation error", formattedErrors));
      }

      const data = await AuthService.register(userDto);

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userDto = plainToInstance(AuthDto, req.body);
      const errors = await validate(userDto);

      if (errors.length > 0) {
        const formattedErrors = handleValidationErrors(errors);
        return next(BaseError.BadRequest("Validation error", formattedErrors));
      }
      const data = await AuthService.login(userDto);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refreshToken(refreshToken);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.logout(refreshToken);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
