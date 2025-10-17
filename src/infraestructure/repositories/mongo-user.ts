import { IUserRepository } from "../../domain/repositories/IUser-repository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/user-mongo";
import { IUsers } from "../../domain/models/interfaces/IUsers";


interface VerificationEntry {
    email: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
}
export class MongoUserRepository implements IUserRepository {

    // aqui se almacenan los codigos de verificacion
    private static verificationCodes: VerificationEntry[] = [];
    private static cleanupInterval: NodeJS.Timeout | null = null;


    static initialize(): void {
        if (!this.cleanupInterval) {
            this.cleanupInterval = setInterval(() => {
                this.cleanupExpiredCodes();
            }, 3600000); // Clean every hour

            console.log('[MONGO USER REPOSITORY] Initialized with verification code cleanup');
        }
    }

    private static cleanupExpiredCodes(): void {
        const now = new Date();
        const before = this.verificationCodes.length;

        this.verificationCodes = this.verificationCodes.filter(
            entry => entry.expiresAt >= now
        );

        const deleted = before - this.verificationCodes.length;
        if (deleted > 0) {
            console.log(`[MONGO USER REPOSITORY] Cleaned ${deleted} expired verification codes`);
        }
    }




    async save(user: User): Promise<User> {
        const created = await UserModel.create(user);
        const plainUser = created.toObject();
        if (plainUser._id && typeof plainUser._id !== 'string') {
            plainUser._id = plainUser._id.toString();
        }
        return new User(plainUser as IUsers);
    }

    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({ email });
        if (!userDoc) {
            return null;
        }

        const plainUser = userDoc.toObject();
        if (plainUser._id && typeof plainUser._id !== 'string') {
            plainUser._id = plainUser._id.toString();
        }

        return new User(plainUser as IUsers);
    }

    async findById(id: string): Promise<User> {
        const resutl = await UserModel.findById(id)
        if (!resutl) {
            return null;
        }
        const userObject = resutl.toObject();
        if (userObject._id && typeof userObject._id !== 'string') {
            userObject._id = userObject._id.toString();
        }
        return new User(userObject as IUsers);
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map(userDoc => {
            const plainUser = userDoc.toObject();
            if (plainUser._id && typeof plainUser._id !== 'string') {
                plainUser._id = plainUser._id.toString();
            }
            return new User(plainUser as IUsers);
        });
    }

    async update(id: string, updatedData: Partial<User>): Promise<User> {
        const updatedUserDoc = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUserDoc) {
            throw new Error('User not found');
        }
        const plainUser = updatedUserDoc.toObject();
        if (plainUser._id && typeof plainUser._id !== 'string') {
            plainUser._id = plainUser._id.toString();
        }
        return new User(plainUser as IUsers);

    }

    async saveVerificationCode(email: string, code: string, expiresAt: Date): Promise<void> {
        const normalizedEmail = email.toLowerCase().trim();

        // Remove previous code if exists
        MongoUserRepository.verificationCodes = MongoUserRepository.verificationCodes.filter(
            entry => entry.email !== normalizedEmail
        );

        // Add new code
        MongoUserRepository.verificationCodes.push({
            email: normalizedEmail,
            code: code,
            expiresAt: expiresAt,
            createdAt: new Date()
        });

        console.log(`[MONGO USER REPOSITORY] Verification code saved for ${email}, expires at: ${expiresAt.toISOString()}`);
    }

    async getVerificationCode(email: string): Promise<{
        code: string;
        expiresAt: Date;
    } | null> {
        const normalizedEmail = email.toLowerCase().trim();
        const entry = MongoUserRepository.verificationCodes.find(
            e => e.email === normalizedEmail
        );

        if (!entry) {
            return null;
        }

        return {
            code: entry.code,
            expiresAt: entry.expiresAt
        };
    }

    async deleteVerificationCode(email: string): Promise<void> {
        const normalizedEmail = email.toLowerCase().trim();
        MongoUserRepository.verificationCodes = MongoUserRepository.verificationCodes.filter(
            e => e.email !== normalizedEmail
        );
        console.log(`[MONGO USER REPOSITORY] Verification code deleted for ${email}`);
    }

    async hasVerificationCode(email: string): Promise<boolean> {
        const normalizedEmail = email.toLowerCase().trim();
        return MongoUserRepository.verificationCodes.some(
            e => e.email === normalizedEmail
        );
    }

    /**
 cursor esto deberia ir aca 
     */
    static destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.verificationCodes = [];
        console.log('[MONGO USER REPOSITORY] Service destroyed');
    }
}