export interface IUser {
    id: number;
    username: string;
    email: string;
    role?: string;
    active?: boolean;
    created?: Date;
    lastActive?: Date;
}
