import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { selectCurrentUserId, selectCurrentUser } from './selectors';
import { Login, Page404, Projects, Register, ProjectTasks, Analytics, AdminPanel, Settings } from './pages';
import { Header } from './components';
import { ROLE } from './constants/role';
import { loginUser, logoutUser } from './actions';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { request } from './utils/request';

function App() {

  const location = useLocation();
  const dispatch = useDispatch();
  const userId = useSelector(selectCurrentUserId);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const hasSavedSession = sessionStorage.getItem('userData');
    
    if (hasSavedSession) {
      request('/auth/me', 'GET')
        .then((res) => {
          if (res && res.user) {
            dispatch(loginUser(res.user));
          } else {
            sessionStorage.removeItem("userData");
            dispatch(logoutUser());
          }
        })
        .catch(() => {
          console.warn("Бэкенд временно недоступен. Используется локальный кэш сессии:", err.message);
        });
    }
  }, [dispatch]);

  const showHeader = location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {userId && showHeader && <Header />}
      <Routes>
        <Route path = '/register' element = {!userId ? <Register /> : < Navigate to = '/' replace/>}/>
        <Route path = '/login' element = {!userId ? <Login /> : < Navigate to = '/' replace/>} />

        <Route path = '/' element = {userId ? <Projects /> : <Navigate to = '/login' replace  />}/>
        <Route path="/:projectId/tasks" element= {userId ? <ProjectTasks /> : <Navigate to="/login" replace/>} />
        <Route path="/:projectId/analytics" element= {userId ? <Analytics /> : <Navigate to="/login" replace/>} />
        <Route path="/settings" element= {userId ? <Settings /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element= {userId && user.role === ROLE.ADMIN ? <AdminPanel /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App;
