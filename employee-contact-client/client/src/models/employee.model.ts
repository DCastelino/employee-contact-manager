export interface Employee {
    id: number;
    name: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    companyId: number;
    companyName: string;
    isActive: boolean;
    createdAt: string;
}