import { useState } from "react";

const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('login', login);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('avatar', avatar);

        setLoading(true);
        setError('');
        setSuccess('');

        fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.message || 'Register Failed');
                    });
                }
                return res.json();
            })
            .then(data => {
                setLoading(false);
                setSuccess('Account created successfully)');
            })
            .catch(err => {
                setLoading(false);
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
            {success && (
                <div className="alert alert-success">
                    {success}
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
                    <label className="form-label">Phone</label>
                    <input className="form-control" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Avatar</label>
                    <input className="form-control" type="file" onChange={(e) => setAvatar(e.target.files[0])} />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                </div>
            </form>
        </div>
    );
}
export default Register;
