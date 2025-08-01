import bcrypt from "bcrypt";
import User, { IUser } from "../schemas/user.schema";
import BaseError from "../utils/base.error";
import jwt from "../utils/jwt";
import IJwtUser from "../types/user";
import { AuthDto } from "../validators/auth.validator";

class AuthService {
  async register({ email, password }: AuthDto) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw BaseError.BadRequest("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return { message: "User registered successfully." };
  }

  async login({ email, password }: AuthDto) {
    const user = await User.findOne({ email });
    const isMatched = await bcrypt.compare(password, user?.password || "");
    if (!user || !isMatched) {
      throw BaseError.BadRequest("Invalid email or password");
    }
    const userDto: IJwtUser = {
      sub: user.id,
      email: user.email,
    };
    const token = jwt.sign(userDto);
    user.refreshTokens.push(token.refreshToken);
    await user.save();
    return { user: userDto, ...token };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw BaseError.UnauthorizedError();
    }

    const userPayload = jwt.validateRefreshToken(refreshToken);
    if (!userPayload) {
      throw BaseError.UnauthorizedError();
    }

    const user = await User.findOne({
      _id: userPayload.sub,
      refreshTokens: refreshToken,
    });
    if (!user) {
      throw BaseError.BadRequest("refresh token is invalid or expired");
    }
    const userDto: IJwtUser = {
      sub: user.id,
      email: user.email,
    };

    const token = jwt.sign(userDto);
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    user.refreshTokens.push(token.refreshToken);
    await user.save();
    return { ...token };
  }

  async logout(refreshToken: string) {
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) {
      throw BaseError.BadRequest("refresh token is invalid or expired");
    }
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      await user.save();
    }
    return { message: "Logged out" };
  }
}

export default new AuthService();
