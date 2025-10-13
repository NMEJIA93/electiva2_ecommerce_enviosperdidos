import { IUsers } from '../models/interfaces/IUsers';

export class User implements IUsers {
    _id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    phone: string;
    roleId: string;
    gender: string;
    birthDate: string;
    status: IUsers['status'];
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    postalCode: string;
    createdAt: Date;
    updatedAt: Date;
    paymentMethodId: string;
    isEmailVerified: boolean;

    constructor(user: IUsers & { id?: string }) {
        this._id = user._id;
        this.email = user.email;
        this.password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.idType = user.idType;
        this.idNumber = user.idNumber;
        this.phone = user.phone;
        this.roleId = user.roleId;
        this.gender = user.gender;
        this.birthDate = user.birthDate;
        this.status = user.status;
        this.country = user.country;
        this.state = user.state;
        this.city = user.city;
        this.neighborhood = user.neighborhood;
        this.address = user.address;
        this.postalCode = user.postalCode;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.paymentMethodId = user.paymentMethodId;
        this.isEmailVerified = user.isEmailVerified;
    }
}