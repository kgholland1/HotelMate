export interface IReservationList {
    id: number;
    noOfPerson: number;
    guestName: string;
    email: string;
    restaurantName: string;
    phone?: string;
    resDate: Date;
    roomNumber: string;
    resTime: string;
    resApproved?: string;
    createdOn: Date;
}

export interface IReservation {
    id: number;
    noOfPerson: number;
    guestName: string;
    email: string;
    restaurantName: string;
    phone?: string;
    resDate: string;
    roomNumber: string;
    resTime: string;
    typeName: string;
    resApproved?: string;
    request?: string;
    feedback?: string;
    createdOn: Date;
    updatedOn: Date;
    updatedBy: string;
}
