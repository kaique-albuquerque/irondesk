import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="panel mx-auto max-w-xl">
      <EmptyState
        icon={<Compass className="size-5" />}
        title="Página não encontrada"
        description="O endereço acessado não existe no IronDesk. Use o menu lateral para voltar à área desejada."
        action={<Button onClick={() => navigate('/')}>Voltar para o dashboard</Button>}
      />
    </div>
  );
}
