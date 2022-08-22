export interface Plot {
    id?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    status: PlotStatus;
    paymentPlan: PaymentPlan;
}

export enum PlotStatus {
    Occupied = "Occupied",
    Vacant = "Vacant",
    ForSale = "For Sale"
}

export enum PaymentPlan {
    Monthly = "Monthly",
    Yearly = "Yearly"
}