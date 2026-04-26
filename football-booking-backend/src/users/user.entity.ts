import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    CUSTOMER = 'customer',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'full_name', type: 'varchar', length: 255 })
    fullName!: string;

    @Column({ name: 'phone', type: 'varchar', length: 15, unique: true })
    phone!: string;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    @Exclude()
    passwordHash!: string;

    @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
    role!: UserRole;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;
}
