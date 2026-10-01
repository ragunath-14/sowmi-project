import { Routes, Route,Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Login from './pages/Login';
import Home from './pages/Home/Home'
import News from './pages/newsSection/News'
import Analyse from './pages/Analytics/Analyse'
import AuditLog from './pages/Admin/AuditLog'
import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/home' element={<Home/>}></Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/news" element={<News />} />
      <Route path="/analyze" element={<Analyse />} />
      <Route path="/admin/audit-log" element={<AuditLog />} />
    </Routes>
    </>
  );
}

export default App;
