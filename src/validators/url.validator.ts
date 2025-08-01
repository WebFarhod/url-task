import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UrlDto {
  @IsString()
  @IsNotEmpty()
  originalUrl: string;
}
