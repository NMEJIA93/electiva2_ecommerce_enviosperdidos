import { IUserRepository } from "../repositories/IUser-repository";
import { User } from "../entities/User";
import { IUsers } from "../models/interfaces/IUsers";
import {isPasswordSecure} from "../business-rules/user-rules"
import * as bcrypt from 'bcryptjs';

export const saveUser = async (userRepo: IUserRepository, user: IUsers) => {
    try {

        const existingUser = await userRepo.findByEmail(user.email);
        if (existingUser) {
            throw new Error('Email must be unique "email already in use"');
        }

        if (!isPasswordSecure(user.password)) {
            throw new Error('Password must be at least 8 characters and include uppercase, lowercase, and numbers');
        }

        const newUser = new User(user);

        return await userRepo.save(newUser);

    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving user: ${error}`);
    }
};
export const updateUserById = async (userRepo: IUserRepository, userId: string, updatedData: Partial<IUsers>) => {
    try {
        return await userRepo.update(userId, updatedData);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error updating user: ${error}`);
    }
};



export const findUserByEmail = async (userRepo: IUserRepository, email: string): Promise<User | null> => {
    try {
        return await userRepo.findByEmail(email);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error finding user by email: ${error}`);
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error hashing password: ${error}`);
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error comparing password: ${error}`);
    }
};

export const findUserById = async (userRepo: IUserRepository, userId: string) => {
    try {

        const user = await userRepo.findById(userId);
        if (user) {
            return user;
        }
        return null
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error finding user by ID: ${error}`);
    }
}

export const findAllUsers = async (userRepo: IUserRepository) => {


    try {
        return await userRepo.findAll();
    } catch (error) {

    }
};


