import apiClient  from "./interceptors";
import type { Company, CreateEmployeeDto, UpdateEmployeeDto, Employee, PaginatedResponse } from '../models/index';

export const employeesApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    companyId?: number;
    active?: boolean;
  }) => {
    const { data } = await apiClient.get<PaginatedResponse<Employee>>('/api/employees', {
      params,
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Employee>(`/api/employees/${id}`);
    return data;
  },

  create: async (employee: CreateEmployeeDto) => {
    const { data } = await apiClient.post<Employee>('/api/employees', employee);
    return data;
  },

  update: async (id: number, employee: UpdateEmployeeDto) => {
    const { data } = await apiClient.put<Employee>(`/api/employees/${id}`, employee);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/employees/${id}`);
  },
};

export const companiesApi = {
  getAll: async () => {
    const { data } = await apiClient.get<Company[]>('/api/companies');
    return data;
  },
};
