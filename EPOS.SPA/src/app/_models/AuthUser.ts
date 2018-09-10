import { UserClaim } from './userClaim';

export class AuthUser {
    tokenString: string;
    userClaims: UserClaim[];
}
