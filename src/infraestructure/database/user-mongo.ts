import mongoose, { Schema, } from 'mongoose';

import { IUserDocument } from '../interface/IUser-mongo';

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    idType: { type: String, required: true },
    idNumber: { type: String, required: true },
    phone: { type: String, required: false },
    roleId: { type: String, required: true },
    gender: { type: String }, 
    birthDate: { type: String}, 
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'], required: true },
    country: { type: String},
    state: { type: String},
    city: { type: String},
    neighborhood: { type: String},
    address: { type: String},
    postalCode: { type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    paymentMethodId: { type: String},
    isEmailVerified: { type: Boolean, default: false }
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);