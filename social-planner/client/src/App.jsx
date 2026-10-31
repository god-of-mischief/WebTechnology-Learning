import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AccountPage from "./pages/AccountPage";
import CalendarPage from "./pages/CalendarPage";
import ContentEditorPage from "./pages/ContentEditorPage";
import AllContent from "./pages/AllContent";

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname.startsWith("/content/");

  return (
    <div className="app-layout">
      {!hideSidebar && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/accounts/new" element={<AccountPage />} />
          <Route path="/accounts/:accountId" element={<AccountPage />} />
          <Route path="/content/new" element={<ContentEditorPage />} />
          <Route path="/content/:contentId/edit" element={<ContentEditorPage />} />
          <Route path="/all-content" element={<AllContent />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}