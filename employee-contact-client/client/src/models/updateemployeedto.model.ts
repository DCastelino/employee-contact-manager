export interface UpdateEmployeeDto {
    name: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    companyId: number;
    isActive: boolean;
}
