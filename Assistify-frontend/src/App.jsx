import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MyRequest from './pages/MyRequest'
import AiSupport from './pages/AiSupport'
import KnowledgeBase from './pages/KnowledgeBase'
import WorkspaceSelector from './pages/WorkspaceSelector'
import StaffVerify from './pages/StaffVerify'
import ServiceDeskDashboard from './pages/ServiceDeskDashboard'
import ServiceDeskRequestDetail from './pages/ServiceDeskRequestDetail'
import ServiceDeskLayout from './layouts/ServiceDeskLayout'
import ServiceRequests from './pages/ServiceRequests'
import Assignment from './pages/Assignment'
import SlaMonitoring from './pages/SlaMonitoring'
import Reports from './pages/Reports'
import AgentLayout from './layouts/AgentLayout'
import AgentDashboard from './pages/AgentDashboard'
import MyTickets from './pages/MyTickets'
import EscalatedTickets from './pages/EscalatedTickets'
import AgentTicketDetail from './pages/AgentTicketDetail'
import MyPerformance from './pages/MyPerformance'
import ManagerLayout from './layouts/ManagerLayout'
import ManagerDashboard from './pages/ManagerDashboard'
import TeamWorkload from './pages/TeamWorkload'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'
import RaiseRequest from './pages/RaiseRequest'
import RequestDetail from './pages/RequestDetail'
import HelpSupport from './pages/HelpSupport'
import Notifications from './pages/Notifications'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/workspace" element={<WorkspaceSelector />} />
                    <Route path="/staff-verify/:workspace" element={<StaffVerify />} />

                    <Route path="/service-desk" element={<ServiceDeskLayout />}>
                        <Route path="dashboard" element={<ServiceDeskDashboard />} />
                        <Route path="requests" element={<ServiceRequests />} />
                        <Route path="requests/:id" element={<ServiceDeskRequestDetail />} />
                        <Route path="knowledge-base" element={<KnowledgeBase />} />
                        <Route path="assignment" element={<Assignment />} />
                        <Route path="sla" element={<SlaMonitoring />} />
                        <Route path="reports" element={<Reports />} />
                    </Route>



                        <Route path="/agent" element={<AgentLayout />}>
                            <Route path="dashboard" element={<AgentDashboard />} />
                            <Route path="my-tickets" element={<MyTickets />} />
                            <Route path="escalated" element={<EscalatedTickets />} />
                            <Route path="tickets/:id" element={<AgentTicketDetail />} />
                            <Route path="performance" element={<MyPerformance />} />
                            <Route path="knowledge-base" element={<KnowledgeBase />} />
                        </Route>

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="knowledge-base" element={<KnowledgeBase />} />
                    </Route>

                    <Route path="/manager" element={<ManagerLayout />}>
                        <Route path="dashboard" element={<ManagerDashboard />} />
                        <Route path="requests" element={<ServiceRequests />} />
                        <Route path="workload" element={<TeamWorkload />} />
                        <Route path="sla" element={<SlaMonitoring />} />
                        <Route path="reports" element={<Reports />} />
                    </Route>

                    <Route element={<UserLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-request" element={<MyRequest />} />
                        <Route path="/my-request/:id" element={<RequestDetail />} />
                        <Route path="/raise-request" element={<RaiseRequest />} />
                        <Route path="/ai-support" element={<AiSupport />} />
                        <Route path="/knowledge-base" element={<KnowledgeBase />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                        <Route path="/help-support" element={<HelpSupport />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Route>



                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App