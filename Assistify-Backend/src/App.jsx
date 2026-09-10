import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyRequest from './pages/MyRequest'
import RaiseRequest from './pages/RaiseRequest'
import AiSupport from './pages/AiSupport'
import KnowledgeBase from './pages/KnowledgeBase'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<UserLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-request" element={<MyRequest />} />
                        <Route path="/raise-request" element={<RaiseRequest />} />
                        <Route path="/ai-support" element={<AiSupport />} />
                        <Route path="/knowledge-base" element={<KnowledgeBase />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;