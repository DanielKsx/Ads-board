import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                login,
                password
            })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.message || 'Login Failed');
                    });
                }
                return res.json();
            })
            .then(data => {
                setUser(data);
                navigate('/');
            })
            .catch(err => {
                setError(err.message);
            });
    };
    return (
        <div className="container mt-4">
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Login</label>
                    <input className="form-control" type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary">Log in </button>
                </div>
            </form>
        </div>
    )
}

export default Login;
