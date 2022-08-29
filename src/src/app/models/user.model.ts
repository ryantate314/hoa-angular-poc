export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    ssoId: string | null;
    role: Role
}

export enum Role {
    Homeowner = "Homeowner",
    Admin = "Admin"
}