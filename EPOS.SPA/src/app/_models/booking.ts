
export interface IBookingList {
    id: number;
    guestName: string;
    email: string;
    phone?: string;
    checkIn: Date;
    roomNumber: string;
}

export interface IBooking {
    id: number;
    guestName: string;
    email: string;
    phone?: string;
    checkIn: Date;
    roomNumber: string;
    checkOut?: Date;
    checkOutBy?: string;
    updatedOn: Date;
    updatedBy: string;
}
