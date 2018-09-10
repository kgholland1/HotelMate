import { IKeyValuePair } from './KeyValuePair';

export interface IListMenu {
    id: number;
    catName: string;
    menuCode: string;
    menuSortNumber: number;
    menuName: string;
    menuSubName: string;
    unitPrice: number;
}

export interface IMenu {
    id: number;
    categoryId: number;
    menuCode?: string;
    menuSortNumber?: number;
    menuName: string;
    menuSubName?: string;
    shortDesc?: string;
    menuDesc?: string;
    unitPrice: number;
    menuImageType: number;
    showExtras: boolean;
    menuExtras: IKeyValuePair[];
}

export interface IMenuSave {
    id: number;
    categoryId: number;
    menuCode?: string;
    menuSortNumber?: number;
    menuName: string;
    menuSubName?: string;
    shortDesc?: string;
    menuDesc?: string;
    unitPrice: number;
    menuImageType: number;
    showExtras: boolean;
    menuExtras: number[];
}
