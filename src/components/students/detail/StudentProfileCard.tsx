import { ArrowLeft, Mail, MapPin, Pencil, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Student } from '@/interfaces/student.interface';
import type { Plan } from '@/interfaces/plan.interface';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { studentStatusLabels } from '@/constants/labels';
import { studentStatusTone } from '@/constants/status';
import { ageFrom, formatCpf, formatPhone } from '@/utils/format';
import { formatDateBR } from '@/utils/date';

interface StudentProfileCardProps {
  student: Student;
  plan: Plan | null;
  onEdit: () => void;
}

export function StudentProfileCard({ student, plan, onEdit }: StudentProfileCardProps) {
  const age = ageFrom(student.birthDate);

  return (
    <div className="space-y-4">
      <Link
        to="/alunos"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Voltar para alunos
      </Link>

      <div className="panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <Avatar name={student.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-ink">{student.name}</h1>
            <Badge tone={studentStatusTone[student.status]}>{studentStatusLabels[student.status]}</Badge>
            {plan ? <Badge tone="accent">{plan.name}</Badge> : <Badge tone="neutral">Sem plano</Badge>}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {student.email}
            </span>
            <span className="inline-flex items-center gap-1.5 tnum">
              <Phone className="size-3.5" />
              {formatPhone(student.phone)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {student.address.city}/{student.address.state}
            </span>
          </div>
        </div>
        <Button variant="secondary" icon={<Pencil className="size-4" />} onClick={onEdit}>
          Editar aluno
        </Button>
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line text-xs sm:grid-cols-4">
        <div className="bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-subtle">CPF</p>
          <p className="mt-1 font-medium text-ink tnum">{formatCpf(student.cpf)}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-subtle">Nascimento</p>
          <p className="mt-1 font-medium text-ink tnum">
            {formatDateBR(student.birthDate)} · {age} anos
          </p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-subtle">Aluno desde</p>
          <p className="mt-1 font-medium text-ink tnum">{formatDateBR(student.createdAt)}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-subtle">Endereço</p>
          <p className="mt-1 truncate font-medium text-ink">{student.address.street}</p>
        </div>
      </div>
    </div>
  );
}
