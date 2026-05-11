import { Link } from 'react-router-dom';

const Header = ({ user, setUser }) => {
    const handleLogout = () => {
        fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                setUser(null);
            });
    };
    return (
        <nav className='navbar bg-light'>
            <div className='container'>
                <div className="navbar-nav flex-row">
                    <Link className="nav-link me-3" to="/">Home</Link>
                    {user ? (
                        <>
                            <Link className="nav-link me-3" to="/ad/add">Add add</Link>
                            <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link me-3" to="/login">Login</Link>
                            <Link className="nav-link" to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Header;