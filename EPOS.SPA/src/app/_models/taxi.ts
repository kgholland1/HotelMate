export interface ITaxiList {
    id: number;
    noOfPerson: number;
    guestName: string;
    email: string;
    phone?: string;
    resDate: Date;
    roomNumber: string;
    resTime: string;
    bookStatus: string;
    createdOn: Date;
}

export interface ITaxi {
    id: number;
    noOfPerson: number;
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
