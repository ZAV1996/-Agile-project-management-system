import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly login: string;

    @IsNotEmpty()
    @IsString()
    readonly per_num: string;

    @IsNotEmpty()
    @IsString()
    readonly LAST_NAME: string

    @IsNotEmpty()
    @IsString()
    readonly FIRST_NAME: string

    @IsNotEmpty()
    @IsString()
    readonly MIDDLE_NAME: string
}
