import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500">هذا القسم قيد التطوير</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/finance" element={<PlaceholderPage title="المالية" />} />
        <Route path="/events" element={<PlaceholderPage title="الأحداث" />} />
        <Route path="/documents" element={<PlaceholderPage title="المستندات" />} />
        <Route path="/settings" element={<PlaceholderPage title="الإعدادات" />} />
      </Route>
    </Routes>
  );
}
