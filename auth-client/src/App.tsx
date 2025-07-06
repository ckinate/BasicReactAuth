
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import IdleTimer from './components/IdleTimer';

function Navigation() {
    const { user, logout } = useAuth();
    return (
        <nav>
            <Link to="/">Home</Link> | {' '}
            {user ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <>
                    <Link to="/login">Login</Link> | {' '}
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

function App() {


  return (
      <AuthProvider>
            {/* The IdleTimer component sits here, inside the AuthProvider */}
            {/* so it has access to the auth context. */}
            <IdleTimer /> 
            
            <Router>
                <Navigation />
                <hr />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        {/* Add other protected routes here */}
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
  )
}

export default App
