import { IsNotEmpty, IsString } from "class-validator";

export class DeleteAuthDto {

    @IsNotEmpty()
    @IsString()
    readonly RT: string;
}