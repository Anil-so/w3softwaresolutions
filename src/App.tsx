import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import OurWork from "./pages/OurWork";
import WebDevelopment from "./pages/WebDevelopment";
import MobileApps from "./pages/MobileApps";
import CustomSoftware from "./pages/CustomSoftware";
import UIUXDesign from "./pages/UIUXDesign";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { DashboardPage } from "./admin/pages/DashboardPage";
import { JobsPage } from "./admin/pages/JobsPage";
import { ApplicationsPage } from "./admin/pages/ApplicationsPage";
import { PaymentsPage } from "./admin/pages/PaymentsPage";
import { InterviewsPage } from "./admin/pages/InterviewsPage";
import { CandidatesPage } from "./admin/pages/CandidatesPage";
import { CareerPageSettings } from "./admin/pages/CareerPageSettings";
import { LocationsPage } from "./admin/pages/LocationsPage";
import { StatisticsPage } from "./admin/pages/StatisticsPage";
import { LeadsPage } from "./admin/pages/LeadsPage";
import { SubscribersPage } from "./admin/pages/SubscribersPage";
import { EmailTemplatesPage } from "./admin/pages/EmailTemplatesPage";
import { SettingsPage } from "./admin/pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/mobile-apps" element={<MobileApps />} />
            <Route path="/custom-software" element={<CustomSoftware />} />
            <Route path="/ui-ux-design" element={<UIUXDesign />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="candidates" element={<CandidatesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="career-page" element={<CareerPageSettings />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="subscribers" element={<SubscribersPage />} />
              <Route path="email-templates" element={<EmailTemplatesPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
