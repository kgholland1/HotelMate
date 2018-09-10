export interface IPhoto {
    id: number;
    photoType: string;
    photoTypeId: number;
    url: string;
    description: string;
    dateAdded: Date;
    isMain: boolean;
}
