import { useNavigate } from 'react-router-dom';
import { Bell, BookOpen, FileText, GraduationCap, HelpCircle, History, LayoutDashboard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { icon: History, label: 'Histórico', href: '#' },
    { icon: Star, label: 'Notas', href: '#' },
    { icon: FileText, label: 'Documentos', href: '#' },
    { icon: HelpCircle, label: 'Suporte', href: '#' },
  ];

  const subjects = [
    { name: 'Cálculo II', grade: 8.5, status: 'cursando' },
    { name: 'Física II', grade: 7.2, status: 'cursando' },
    { name: 'Programação OO', grade: 9.0, status: 'cursando' },
    { name: 'Estatística', grade: 6.8, status: 'cursando' },
    { name: 'Inglês Técnico', grade: 8.0, status: 'cursando' },
  ];

  const notices = [
    { text: 'Entrega do trabalho de Cálculo II — 02/04', type: 'deadline' as const },
    { text: 'Pendência: Atualizar dados cadastrais', type: 'pending' as const },
    { text: 'Prova de Física II — 08/04', type: 'deadline' as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-foreground text-lg leading-tight">UniSystem</h1>
                <p className="text-xs text-muted-foreground">Sistema Acadêmico</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {['Dashboard', 'Matrícula', 'Acadêmico', 'Financeiro'].map(item => (
                <button key={item} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item === 'Dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">JM</span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">João Martins</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-primary-foreground/20" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-primary-foreground/10" />
              </div>
              <div className="relative">
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-3">
                  Período de Matrícula
                </Badge>
                <h2 className="font-display text-2xl font-bold mb-1">
                  Matrícula aberta para 2026.2
                </h2>
                <p className="text-primary-foreground/80 mb-4">
                  Prazo: 15/03 a 30/03/2026
                </p>
                <Button
                  onClick={() => navigate('/matricula')}
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-display font-bold text-base px-8 shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Fazer Matrícula
                </Button>
              </div>
            </motion.div>

            {/* Semester Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="font-display font-bold text-lg text-foreground mb-3">Semestre Atual — 2026.1</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Disciplinas</p>
                  <p className="text-2xl font-display font-bold text-foreground">5</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">CR Atual</p>
                  <p className="text-2xl font-display font-bold text-primary">7.9</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Créditos</p>
                  <p className="text-2xl font-display font-bold text-foreground">20</p>
                </div>
              </div>

              {/* Subjects */}
              <div className="bg-card rounded-xl border border-border divide-y divide-border">
                {subjects.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-primary">{s.grade.toFixed(1)}</span>
                      <Badge variant="secondary" className="text-xs">{s.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notices */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="font-display font-bold text-lg text-foreground mb-3">Avisos Importantes</h3>
              <div className="space-y-2">
                {notices.map((n, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${n.type === 'pending' ? 'border-warning/30 bg-warning/5' : 'border-border bg-card'}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'pending' ? 'bg-warning' : 'bg-primary'}`} />
                    <span className="text-sm text-foreground">{n.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Quick Links */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
              <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Acesso Rápido
              </h4>
              <nav className="space-y-1">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-muted-foreground" />
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Próximo evento</p>
                  <p className="text-sm font-medium text-foreground">Prova Cálculo II</p>
                  <p className="text-xs text-primary font-semibold">02/04 — 14h</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
