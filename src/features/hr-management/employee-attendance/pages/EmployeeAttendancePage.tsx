import React from 'react';
import { useEmployeeAttendance } from '../hooks/useEmployeeAttendance';
import { EmployeeAttendanceTable } from '../components/EmployeeAttendanceTable';

export const EmployeeAttendancePage: React.FC = () => {
  const {
    data,
    selectedPeriode,
    isLoading,
    meta,
    page,
    setPage,
    setPageSize,
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    filterSubDept,
    setFilterSubDept,
    handlePeriodeChange,
  } = useEmployeeAttendance();

  return (
    <div className="space-y-6">
      <EmployeeAttendanceTable
        data={data}
        selectedPeriode={selectedPeriode}
        onPeriodeChange={handlePeriodeChange}
        isLoading={isLoading}
        meta={meta}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterDept={filterDept}
        onDeptChange={setFilterDept}
        filterSubDept={filterSubDept}
        onSubDeptChange={setFilterSubDept}
      />
    </div>
  );
};

export default EmployeeAttendancePage;