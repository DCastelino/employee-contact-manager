import { createContext, useContext, useState, ReactNode } from 'react';

interface EmployeeContextType {
  pageSize: number;
  setPageSize: (size: number) => void;
  density: 'compact' | 'standard' | 'comfortable';
  setDensity: (density: 'compact' | 'standard' | 'comfortable') => void;
}

const EmployeesContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const [pageSize, setPageSize] = useState(20);
  const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');

  return (
    <EmployeesContext.Provider value={{ pageSize, setPageSize, density, setDensity }}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployeesProvider = () => {
  const context = useContext(EmployeesContext);
  if (context === undefined) {
    throw new Error('no provider found');
  }
  return context;
};
