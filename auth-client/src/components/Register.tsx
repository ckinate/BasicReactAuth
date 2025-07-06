import { useState } from "react";
import apiClient from "../api/axios";


const Register = () => {
      const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await apiClient.post('/auth/register', { email, password });
            setMessage(response.data.message);
        } catch (err: any) {
            setError(err.response?.data?.errors?.[0]?.description || 'Registration failed');
        }
    };
  return (
      <div>
            <h2>Register</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
  )
}

export default Register