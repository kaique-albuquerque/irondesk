import { useMemo, useState } from 'react';
import { DoorOpen, Search as SearchIcon } from 'lucide-react';
import type { Student } from '@/interfaces/student.interface';
import { checkinsService } from '@/services/api/checkins.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { todayISO } from '@/utils/date';

interface ReceptionCheckinCardProps {
  students: Student[];
  openStudentIds: Set<string>;
  onCheckedIn: () => void | Promise<void>;
}

export function ReceptionCheckinCard({ students, openStudentIds, onCheckedIn }: ReceptionCheckinCardProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const eligible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return students
      .filter((student) => student.status === 'active')
      .filter(
        (student) =>
          !term || student.name.toLowerCase().includes(term) || student.email.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [students, search]);

  const { run: checkin, loading } = useAsyncAction(async (student: Student) => {
    return checkinsService.create({
      studentId: student.id,
      date: todayISO(),
      checkInAt: new Date().toISOString(),
    });
  });

  const handleCheckin = async (student: Student) => {
    setActiveId(student.id);
    const created = await checkin(student);
    setActiveId(null);
    if (!created) return;
    toast('Entrada registrada', { description: student.name });
    setSearch('');
    await onCheckedIn();
  };

  return (
    <div className="panel flex flex-col p-5">
      <div>
        <h2 className="text-sm font-semibold text-ink">Registrar entrada</h2>
        <p className="mt-0.5 text-xs text-muted">Busque o aluno na recepção para abrir o check-in.</p>
      </div>

      <SearchInput
        value={search}
        onValueChange={setSearch}
        placeholder="Nome ou e-mail do aluno"
        className="mt-3"
      />

      <div className="mt-3 flex-1">
        {eligible.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum aluno encontrado"
            description="Ajuste a busca para localizar o aluno."
          />
        ) : (
          <ul className="divide-y divide-line">
            {eligible.map((student) => {
              const isOpen = openStudentIds.has(student.id);
              return (
                <li key={student.id} className="flex items-center gap-3 py-2.5">
                  <Avatar name={student.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{student.name}</p>
                    <p className="truncate text-[11px] text-subtle">{student.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isOpen ? 'ghost' : 'outline'}
                    disabled={isOpen}
                    loading={loading && activeId === student.id}
                    icon={<DoorOpen className="size-3.5" />}
                    onClick={() => void handleCheckin(student)}
                  >
                    {isOpen ? 'Em aberto' : 'Check-in'}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
