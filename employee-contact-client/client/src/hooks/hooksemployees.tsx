import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi, companiesApi } from '../api/index';
import type { CreateEmployeeDto, UpdateEmployeeDto } from '../models/index';

export const useEmployees = (params: {
  page: number;
  pageSize: number;
  search?: string;
  companyId?: number;
  active?: boolean;
}) => {
  return useQuery({
    queryKey: ['employees', params.page, params.pageSize, params.search, params.companyId, params.active],
    queryFn: () => employeesApi.getAll(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (employee: CreateEmployeeDto) => employeesApi.create(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, employee }: { id: number; employee: UpdateEmployeeDto }) =>
      employeesApi.update(id, employee),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
    staleTime: 5 * 60 * 1000, // Consider companies data fresh for 5 minutes
  });
};
