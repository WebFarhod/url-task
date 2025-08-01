import shortid from "shortid";
import { UrlDto } from "../validators/url.validator";
import Url from "../schemas/url.schema";
import IJwtUser from "../types/user";
import BaseError from "../utils/base.error";

class UrlService {
  async shortenUrl({ originalUrl }: UrlDto, user: IJwtUser) {
    const shortCode = shortid.generate();
    await Url.create({
      originalUrl,
      shortCode,
      user: user.sub,
    });

    return {
      shortCode,
      shortUrl: `http://localhost:${process.env.PORT}/api/url/${shortCode}`,
    };
  }

  async getStats(shortCode: string, user: IJwtUser) {
    const url = await Url.findOne({ shortCode });

    if (!url) {
      throw BaseError.NotFoundError("URL not found");
    }

    if (url.user.toString() !== user.sub) {
      throw BaseError.ForbiddenError();
    }

    return {
      originalUrl: url.originalUrl,
      visits: url.visits,
      createdAt: url.createdAt,
    };
  }

  async redirectUrl(shortCode: string) {
    const url = await Url.findOne({ shortCode });

    if (!url) {
      throw BaseError.NotFoundError("URL not found");
    }

    url.visits += 1;
    await url.save();

    return url.originalUrl;
  }
}

export default new UrlService();
