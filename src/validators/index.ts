import { IsString } from "class-validator";

export class LoginUserBody {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
