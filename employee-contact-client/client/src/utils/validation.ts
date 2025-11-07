import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
  phone: z
    .string()
    .regex(/^\d{3}-\d{4}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  jobTitle: z.string().max(100, 'Job title cannot exceed 100 characters').optional().or(z.literal('')),
  companyId: z.number().min(1, 'Company is required'),
  isActive: z.boolean(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
