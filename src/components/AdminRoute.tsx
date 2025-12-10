import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isAdminAuthenticated = localStorage.getItem('adminAuth') === 'true';

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  return isAdminAuthenticated ? <>{children}</> : null;
}
