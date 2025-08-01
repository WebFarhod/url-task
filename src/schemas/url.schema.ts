import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.schema";

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  user: IUser;
  visits: number;
  createdAt: Date;
}

const UrlSchema: Schema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, unique: true },
    user: { type: Types.ObjectId, ref: "User" },
    visits: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Url = model<IUrl>("Url", UrlSchema);

export default Url;
