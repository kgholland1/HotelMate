export interface INote {
    id: number;
    notes: string;
    createdOn?: Date;
    createdBy?: string;
    bookingId: number
}
