import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryColumn, Column } from "typeorm";


@Entity()
export class JWTSession {
    @ApiProperty({ example: 1, description: "Идернификатор токена" })
    @PrimaryColumn()
    UUID: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphdjIwNTcxQHV1YXAuY29tIiwiaWF0IjoxNzA1NDU1NTU1LCJleHAiOjE3MDYwNjAzNTV9.F8FCGzOPhwzA84Gp6iFOu5MRb8MZKwAotAN1YOjJuyc", description: "Refresh Token" })
    @Column("varchar", { length: 1500 })
    REFRESH_TOKEN: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphdjIwNTcxQHV1YXAuY29tIiwiaWF0IjoxNzA1NDU1NTU1LCJleHAiOjE3MDYwNjAzNTV9.F8FCGzOPhwzA84Gp6iFOu5MRb8MZKwAotAN1YOjJuyc", description: "Refresh Token" })
    @Column("varchar", { length: 1500 })
    ACCESS_TOKEN: string;

    @ApiProperty({ example: "12345", description: "Табельный номер" })
    @Column()
    PER_NUM: string
}
