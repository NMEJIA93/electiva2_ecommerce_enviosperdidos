export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    msg: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        phone: string;
    };
}

export interface ErrorResponse {
    type: string;
    msg: string;
}

export function buildLoginRequest(body: any): LoginRequest {
    return {
        email: body.email,
        password: body.password
    };
}

export function buildAuthResponse(msg: string, token?: string, user?: any): AuthResponse {
    return {
        msg,
        token,
        user
    };
}

export function buildErrorResponse(type: string, msg: string): ErrorResponse {
    return {
        type,
        msg
    };
}