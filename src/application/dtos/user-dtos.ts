import { IUsers } from "../../domain/models/interfaces/IUsers";

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

export interface UserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    phone: string;
    roleId: string;
    gender?: string;
    birthDate?: string;
    status: UserStatus;
    country?: string;
    state?: string;
    city?: string;
    neighborhood?: string;
    address?: string;
    postalCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
    paymentMethodId?: string;
    isEmailVerified?: boolean;
}


export function buildUserRequest(dto: UserRequest): IUsers {
    return {
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        idType: dto.idType,
        idNumber: dto.idNumber,
        phone: dto.phone,
        roleId: dto.roleId,
        gender: dto.gender,
        birthDate: dto.birthDate,
        status: dto.status,
        country: dto.country,
        state: dto.state,
        city: dto.city,
        neighborhood: dto.neighborhood,
        address: dto.address,
        postalCode: dto.postalCode,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        paymentMethodId: dto.paymentMethodId,
        isEmailVerified: dto.isEmailVerified,
    };
}


export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    phone?: string;
    roleId: string;
    gender?: string;
    birthDate?: string;
    status: string;
    country?: string;
    state?: string;
    city?: string;
    neighborhood?: string;
    address?: string;
    postalCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isEmailVerified?: boolean;
}


export function buildUserResponse(user: any): UserResponse {
    return {
        id: user._id ?? user.id ?? '',
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        idType: user.idType,
        idNumber: user.idNumber,
        phone: user.phone,
        roleId: user.roleId,
        gender: user.gender,
        birthDate: user.birthDate,
        status: user.status,
        country: user.country,
        state: user.state,
        city: user.city,
        neighborhood: user.neighborhood,
        address: user.address,
        postalCode: user.postalCode,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isEmailVerified: user.isEmailVerified,
    };
}

export interface VerificationRequest {
    email: string;
    code: string;
}

export interface ResendCodeRequest {
    email: string;
}

export function buildVerificationRequest(dto: any): VerificationRequest {
    return {
        email: dto.email,
        code: dto.code
    };
}

export function buildResendCodeRequest(dto: any): ResendCodeRequest {
    return {
        email: dto.email
    };
}