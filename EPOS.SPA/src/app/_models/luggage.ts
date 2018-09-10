export interface ILuggageList {
    id: number;
    noOfLuggage: number;
    guestName: string;
    email: string;
    phone?: string;
    resDate: Date;
    roomNumber: string;
    resTime: string;
    bookStatus: string;
    createdOn: Date;
}

export interface ILuggage {
    id: number;
    noOfLuggage: number;
    guestName: string;
    email: string;
    phone?: string;
    resDate: string;
    roomNumber: string;
    resTime: string;
    bookStatus: string;
    request?: string;
    response?: string;
    createdOn: Date;
    updatedOn: Date;
    updatedBy: string;
}
