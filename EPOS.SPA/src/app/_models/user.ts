export interface IUser {
    id: number;
    username: string;
    email: string;
    hotelId: number;
}

export interface ISystemUser {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    department?: string;
    position?: string;
    lastActive: Date;
    roles: string[];
}
