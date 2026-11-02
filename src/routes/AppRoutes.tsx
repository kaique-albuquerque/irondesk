import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { DashboardPage } from '@/pages/DashboardPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { StudentDetailPage } from '@/pages/StudentDetailPage';
import { EnrollmentsPage } from '@/pages/EnrollmentsPage';
import { CheckinsPage } from '@/pages/CheckinsPage';
import { PlansPage } from '@/pages/PlansPage';
import { WorkoutsPage } from '@/pages/WorkoutsPage';
import { AssessmentsPage } from '@/pages/AssessmentsPage';
import { FinancePage } from '@/pages/FinancePage';
import { ReportsPage } from '@/pages/ReportsPage';
import { TeamPage } from '@/pages/TeamPage';
import { IntegrationsPage } from '@/pages/IntegrationsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="alunos" element={<StudentsPage />} />
              <Route path="alunos/:id" element={<StudentDetailPage />} />
              <Route path="matriculas" element={<EnrollmentsPage />} />
              <Route path="frequencia" element={<CheckinsPage />} />
              <Route path="planos" element={<PlansPage />} />
              <Route path="treinos" element={<WorkoutsPage />} />
              <Route path="avaliacoes" element={<AssessmentsPage />} />
              <Route path="financeiro" element={<FinancePage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="equipe" element={<TeamPage />} />
              <Route path="integracoes" element={<IntegrationsPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
