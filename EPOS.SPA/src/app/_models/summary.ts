export interface IDashboardSummary {
    orders: number;
    reservations: number;
    bookings: number;
    keepings: number
}

export interface IDashboardGraph {
    selectedPeriod: string;
    dataLabels: any[];
    dataCounters: any[];
}
