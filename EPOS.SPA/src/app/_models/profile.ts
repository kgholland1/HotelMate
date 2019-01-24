export interface IProfile {
    id: number;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    department?: string;
    position?: string;
    hotelName?: string;
    hotelCode?: string;
    created?: Date;
    lastActive?: Date;
}
