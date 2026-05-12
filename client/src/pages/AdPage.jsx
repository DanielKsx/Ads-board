import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


const AdPage = ({ user }) => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDelete = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/ads/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.message || 'Delete Failed');
                    });
                }
                navigate('/');
            })
            .catch(err => {
                setError(err.message);
            });
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/ads/${id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setAd(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="container mt-4">
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            <div className="row">
                <div className="col-12 col-md-6">
                    {ad.image && (
                        <img
                            src={`${import.meta.env.VITE_API_URL}${ad.image}`}
                            alt={ad.title}
                            className="img-fluid"
                        />
                    )}
                </div>
                <div className="col-12 col-md-6">
                    <h1>{ad.title}</h1>
                    <p><strong>Location: </strong>{ad.location}</p>
                    <p><strong>Price: </strong>{ad.price}</p>
                    <p>{ad.content}</p>
                    <p>{new Date(ad.date).toLocaleString()}</p>
                    {user && ad.seller && user.id === ad.seller._id && (
                        <div className="mt-3">
                            <Link className="btn btn-warning me-2" to={`/ad/edit/${ad._id}`}>Edit</Link>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <h4>Seller</h4>
                    {ad.seller && (
                        <>
                            <p>{ad.seller.login}</p>
                            <p>{ad.seller.phone}</p>
                            {ad.seller.avatar && (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${ad.seller.avatar}`}
                                    alt={ad.seller.login}
                                    className="img-fluid"
                                    style={{ maxWidth: '150px' }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdPage;
