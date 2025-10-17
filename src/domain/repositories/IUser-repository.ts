import {User} from '../entities/User';

export interface IUserRepository {
    save(user: User): Promise<User>;
    update(id: string, updatedData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    saveVerificationCode(email: string, code: string, expiresAt: Date): Promise<void>;
    getVerificationCode(email: string): Promise<{code: string;expiresAt: Date;} | null>;
    deleteVerificationCode(email: string): Promise<void>;
    hasVerificationCode(email: string): Promise<boolean>;
}
