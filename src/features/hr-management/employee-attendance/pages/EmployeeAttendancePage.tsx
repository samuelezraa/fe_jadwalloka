import React from 'react';
import { useEmployeeAttendance } from '../hooks/useEmployeeAttendance';
import { EmployeeAttendanceTable } from '../components/EmployeeAttendanceTable';

export const EmployeeAttendancePage: React.FC = () => {
  const { data, selectedPeriode, isLoading, handlePeriodeChange } = useEmployeeAttendance();

  return (
    <div className="space-y-6">
      <EmployeeAttendanceTable
        data={data}
        selectedPeriode={selectedPeriode}
        onPeriodeChange={handlePeriodeChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeeAttendancePage;