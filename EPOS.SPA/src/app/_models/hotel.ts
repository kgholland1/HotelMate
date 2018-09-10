import { IPhoto } from './photo';

export interface IHotel {
    id: number,
    hotelName: string,
    hotelCode: string,
    introduction: string,
    history: string,
    address1?: string,
    address2?: string,
    town?: string,
    county?: string,
    country?: string,
    postCode?: string,
    phone?: string,
    email?: string,
    website?: string,
    UpdatedOn: string;
    UpdatedBy: string;
    photos?: IPhoto[];
}
