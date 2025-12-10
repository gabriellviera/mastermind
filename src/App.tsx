import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import MyCourses from './pages/MyCourses';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetail from './pages/CourseDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAnalytics from './pages/Admin/AdminAnalytics';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminComments from './pages/Admin/AdminComments'; // Now exists
import AdminUsers from './pages/Admin/AdminUsers'; // Now exists
import AdminHomeConfig from './pages/Admin/AdminHomeConfig'; // Now exists
import AdminPopupConfig from './pages/Admin/AdminPopupConfig';  // Now exists
import PopupBanner from './components/PopupBanner';  // Now exists

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <PopupBanner />
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/curso-info/:id" element={<CourseDetail />} />
          <Route path="/curso/:id" element={<CoursePlayer />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="home-config" element={<AdminHomeConfig />} />
            <Route path="popup-config" element={<AdminPopupConfig />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
