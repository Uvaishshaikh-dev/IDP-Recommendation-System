import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Goals from './pages/Goals';
import Flashcards from './pages/Flashcards';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

import { ProfileProvider } from './context/ProfileContext';

import './App.css';

function ProtectedRoute({ children, role }) {
    const savedUser = localStorage.getItem('idp-user');

    if (!savedUser) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(savedUser);

    if (role && user.role !== role) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function StudentLayout() {
    return (
        <ProtectedRoute role="student">
            <div className="app-layout">

                <Sidebar />

                <main className="main-content">
                    <Routes>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/assessment"
                            element={<Assessment />}
                        />

                        <Route
                            path="/goals"
                            element={<Goals />}
                        />

                        <Route
                            path="/flashcards"
                            element={<Flashcards />}
                        />

                        <Route
                            path="*"
                            element={<Navigate to="/" replace />}
                        />

                    </Routes>
                </main>

            </div>
        </ProtectedRoute>
    );
}

function App() {
    return (
        <ProfileProvider>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/*"
                    element={<StudentLayout />}
                />

            </Routes>
        </ProfileProvider>
    );
}

export default App;