import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TempleDetail from "./pages/TempleDetail";
import CalendarPage from "./pages/CalendarPage";
import AddTemplePage from "./pages/AddTemplePage";
import EducationPage from "./pages/EducationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CustodiansPage from "./pages/CustodiansPage";
import CustodianDetailPage from "./pages/CustodianDetailPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import KnowledgePage from "./pages/KnowledgePage";
import CustodianDashboardPage from "./pages/CustodianDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ApplyCustodianPage from "./pages/ApplyCustodianPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/temple/:id" element={<TempleDetail />} />

              {/* Custodian & Experience Platform Routes */}
              <Route path="/custodians" element={<CustodiansPage />} />
              <Route path="/custodians/:id" element={<CustodianDetailPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/apply-custodian" element={<ApplyCustodianPage />} />

              {/* Protected Operational & Governance Hubs */}
              <Route
                path="/custodian/dashboard"
                element={
                  <ProtectedRoute>
                    <CustodianDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-temple"
                element={
                  <ProtectedRoute>
                    <AddTemplePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
