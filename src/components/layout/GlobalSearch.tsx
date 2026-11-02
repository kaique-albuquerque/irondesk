import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { selectCollection } from '@/services/storage/database.service';
import { Avatar } from '@/components/ui/Avatar';

export function GlobalSearch() {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (query.length < 2) return [];
    return selectCollection('students')
      .filter((student) => student.name.toLowerCase().includes(query) || student.email.toLowerCase().includes(query))
      .slice(0, 5);
  }, [term]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden w-full max-w-sm md:block">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
      <input
        value={term}
        onChange={(event) => {
          setTerm(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar aluno por nome ou e-mail"
        aria-label="Busca rápida de alunos"
        className="control h-9 pl-9"
      />
      {open && results.length > 0 ? (
        <div className="absolute top-full right-0 left-0 mt-1 overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-panel">
          {results.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => {
                navigate(`/alunos/${student.id}`);
                setTerm('');
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-surface-2"
            >
              <Avatar name={student.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-ink">{student.name}</span>
                <span className="block truncate text-[11px] text-subtle">{student.email}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
