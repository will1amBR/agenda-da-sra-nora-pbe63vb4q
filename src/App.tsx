/* Main App Component - Handles routing (using react-router-dom), query client and other providers */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Home from './pages/Home'
import AgendarPage from './pages/Agendar'
import MinhasReservasPage from './pages/MinhasReservas'
import NotFound from './pages/NotFound'
import SiteLayout from './components/SiteLayout'
import AdminLayout from './components/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboard'
import AdminSolicitacoesPage from './pages/admin/AdminSolicitacoes'
import AdminAgendaPage from './pages/admin/AdminAgenda'
import AdminLembretesPage from './pages/admin/AdminLembretes'
import AdminPagamentosPage from './pages/admin/AdminPagamentos'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Rotas Públicas do Site da Sra Nora */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agendar" element={<AgendarPage />} />
          <Route path="/minhas-reservas" element={<MinhasReservasPage />} />
        </Route>

        {/* Rotas Administrativas do Painel da Nora */}
        <Route path="/painel" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="solicitacoes" element={<AdminSolicitacoesPage />} />
          <Route path="agenda" element={<AdminAgendaPage />} />
          <Route path="lembretes" element={<AdminLembretesPage />} />
          <Route path="pagamentos" element={<AdminPagamentosPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
