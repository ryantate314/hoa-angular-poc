export interface Event {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    description: string;
    imageUrl: string | null;
    location: string;
}