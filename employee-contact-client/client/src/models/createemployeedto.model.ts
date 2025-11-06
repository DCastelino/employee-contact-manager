export interface CreateEmployeeDto {
    name: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    companyId: number;
    isActive: boolean;
}