import 'dotenv/config';

export class JWTConfig {
    private static _secret: string;
    private static _expiresIn: string;

    public static get secret(): string {
        if (!this._secret) {
            this._secret = process.env.JWT_SECRET;
            
            if (!this._secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }
            
            if (this._secret.length < 32) {
                throw new Error('JWT_SECRET must be at least 32 characters long for security');
            }
        }
        return this._secret;
    }

    public static get expiresIn(): string {
        if (!this._expiresIn) {
            this._expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        }
        return this._expiresIn;
    }

    public static validateConfig(): void {
        try {
            this.secret;
            console.log('[JWT-CONFIG] ✅ JWT configuration is valid');
        } catch (error) {
            console.error('[JWT-CONFIG] ❌ JWT configuration error:', (error as Error).message);
            throw error;
        }
    }
}