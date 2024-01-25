import { ApiProperty } from "@nestjs/swagger"
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class User {
    @ApiProperty({ example: 1, description: "Идернификатор пользователя" })
    @PrimaryGeneratedColumn()
    ID?: number


    @ApiProperty({ example: "iii012345", description: "Логин пользователя" })
    @PrimaryColumn("varchar", { length: 12 })
    LOGIN: string

    @ApiProperty({ example: "Иванов", description: "Фамилия пользователя" })
    @Column("varchar", { length: 25, nullable: true })
    LAST_NAME?: string

    @ApiProperty({ example: "Иван", description: "Имя пользователя" })
    @Column("varchar", { length: 25, nullable: true })
    FIRST_NAME?: string

    @ApiProperty({ example: "Иванович", description: "Отчество пользователя" })
    @Column("varchar", { length: 25, nullable: true })
    MIDDLE_NAME?: string

    @ApiProperty({ example: "Администратор баз данных", description: "Должность пользователя" })
    @Column({ nullable: true })
    POS_NAME?: string

    @ApiProperty({ example: "iii012345@domain.com", description: "Адрес электронной почты пользователя" })
    @Column("varchar", { length: 25, nullable: false, unique: true })
    EMAIL: string

    @ApiProperty({ example: "Сергеев Сергей Сергеевич", description: "Руководитель" })
    @Column({ nullable: true })
    BOSS_NAME?: string

    @ApiProperty({ example: "012345", description: "Табельный номер" })
    @PrimaryColumn({ length: 6, nullable: false, unique: true })
    PER_NUM: string

    @ApiProperty({ example: "Отдел", description: "Тип подразделения: Отдел | Цех | Завод | Бюро и т.д." })
    @Column("varchar", { length: 25, nullable: true })
    TYPE_SUBDIV_NAME?: string

    @ApiProperty({ example: "079", description: "Код подразделения" })
    @Column({ length: 4, nullable: true })
    CODE_SUBDIV?: string

    @Column({ default: false })
    isActivated: boolean

    @Column({ nullable: true, type: 'varchar', })
    activationToken: string | null

    @Column({
        nullable: true,
        type: 'varchar',
    })
    forgotToken: string | null

    @Column()
    PASSWORD: string

}
