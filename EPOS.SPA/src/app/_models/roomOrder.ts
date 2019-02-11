export interface IRoomOrder {
    id: number,
    guestName: string,
    roomNumber: string,
    orderStatus: string,
    orderDate: string,
    orderTime: string,
    total: number,
    paid: boolean,
    createdOn: Date
}
