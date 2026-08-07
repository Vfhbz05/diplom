import { Routes, Route, useLocation } from 'react-router-dom';
//Navigate
//import { useSelector } from 'react-redux';
//import { selectCurrentUserId, selectCurrentUser } from './selectors';
import { Login, Page404, Projects, Register, ProjectTasks, Analytics, AdminPanel, Settings } from './pages';
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

        <Route path = '/' element = {<Projects />} /* {userId ? <Projects /> : <Navigate to = '/login'/>} *//>
        <Route path="/:projectId/tasks" element= {<ProjectTasks />}/*{userId ? <ProjectTasks /> : <Navigate to="/login" />} */ />
        <Route path="/:projectId/analytics" element= {<Analytics />}/*{userId ? <Analytics /> : <Navigate to="/login" />}  *//>
        <Route path="/admin" element= {<AdminPanel />}/*{userId && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/"/>} *//>
        <Route path="/settings" element= {<Settings />}/*{userId ? <Settings /> : <Navigate to="/login" />}*/ />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App;
