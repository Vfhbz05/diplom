import { Routes, Route, useLocation } from 'react-router-dom';
//Navigate
//import { useSelector } from 'react-redux';
//import { selectCurrentUserId, selectCurrentUser } from './selectors';
import { Login, Page404, Register } from './pages';
import { Header } from './components';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from './selectors';

function App() {

  const location = useLocation();
  const userId = useSelector(selectCurrentUserId);

  //const user = useSelector(selectCurrentUser);

  const showHeader = location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {userId && showHeader && <Header />}
      <Routes>
        <Route path = '/register' element = {< Register/>}/* {!userId ? <Register /> : < Navigate to = '/'/>}*//>
        <Route path = '/login' element = {<Login />}/*{!userId ? <Login /> : < Navigate to = '/'/>} *//>

        <Route path = '/' element = {<div>Страница  со всеми проектами</div>} /* {userId ? <Projects /> : <Navigate to = '/login'/>} *//>
        <Route path="/:projectId/tasks" element= {<div>Страница с внутренностями проекта</div>}/*{userId ? <ProjectTasks /> : <Navigate to="/login" />} */ />
        <Route path="/analytics" element= {<div>Страница с аналитикой</div>}/*{userId ? <Analytics /> : <Navigate to="/login" />}  *//>
        <Route path="/admin" element= {<div>Панель для администратора</div>}/*{userId && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/"/>} *//>
        <Route path="/settings" element= {<div>Страница настроек аккаунта</div>}/*{userId ? <Settings /> : <Navigate to="/login" />}*/ />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App;
