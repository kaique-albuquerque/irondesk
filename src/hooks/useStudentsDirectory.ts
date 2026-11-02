import { useEffect, useMemo, useState } from 'react';
import type { Plan } from '@/interfaces/plan.interface';
import { studentsService } from '@/services/api/students.service';
import { plansService } from '@/services/api/plans.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useDebounce } from '@/hooks/useDebounce';

export type StatusFilter = 'all' | 'active' | 'inactive';

export function useStudentsDirectory(pageSize = 8) {
  const { data, loading, reload } = useAsyncData(async () => {
    const [students, plans] = await Promise.all([studentsService.list(), plansService.list()]);
    return { students, plans };
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, planFilter]);

  const students = data?.students ?? [];
  const plans = data?.plans ?? [];

  const plansById = useMemo(
    () =>
      plans.reduce<Record<string, Plan>>(
        (accumulator, plan) => ({ ...accumulator, [plan.id]: plan }),
        {},
      ),
    [plans],
  );

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return students.filter((student) => {
      const matchesTerm =
        !term ||
        [student.name, student.email, student.cpf, student.phone].some((value) =>
          value.toLowerCase().includes(term),
        );
      const matchesStatus = status === 'all' || student.status === status;
      const matchesPlan =
        planFilter === 'all' ||
        (planFilter === 'none' ? !student.planId : student.planId === planFilter);
      return matchesTerm && matchesStatus && matchesPlan;
    });
  }, [students, debouncedSearch, status, planFilter]);

  return {
    students,
    plans,
    plansById,
    loading,
    reload,
    filtered,
    visible: filtered.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    planFilter,
    setPlanFilter,
  };
}
