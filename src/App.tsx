import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnrollmentProvider } from "@/context/EnrollmentContext";
import Dashboard from "./pages/Dashboard";
import EnrollmentPage from "./pages/EnrollmentPage";
import Attendance from "./pages/Attendance";
import SubjectDetail from "./pages/SubjectDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EnrollmentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/matricula" element={<EnrollmentPage />} />
            <Route path="/presenca" element={<Attendance />} />
            <Route path="/materia/:id" element={<SubjectDetail />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EnrollmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
