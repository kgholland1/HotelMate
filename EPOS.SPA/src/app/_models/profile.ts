export interface IProfile {
    id: number;
    username: string;
    email: string;
    oldEmail?: string;
    hotelName?: string;
    hotelCode?: string;
    created?: Date;
    lastActive?: Date;
}
