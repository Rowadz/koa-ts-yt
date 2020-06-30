import { IsEmail, IsDefined, IsString } from 'class-validator'

export class LoginRules {
  @IsDefined({ always: true })
  @IsEmail()
  @IsString()
  email: string

  @IsDefined({ always: true })
  @IsString()
  password: string
}
