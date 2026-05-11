import { useState, useEffect } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";


const EditAd = ({ user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    if (!user) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/ads/${id}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setAd(data);
                setTitle(data.title);
                setContent(data.content);
                setLocation(data.location);
                setPrice(data.price);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <h2>Loading...</h2>
    }

    if (ad && ad.seller && user.id !== ad.seller._id) {
        return <Navigate to="/" />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);
        formData.append('location', location);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }
        setSaving(true);
        setError('');


        fetch(`${import.meta.env.VITE_API_URL}/api/ads/${id}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.message || 'Saving failed');
                    });
                }

                return res.json();
            })
            .then(data => {
                setSaving(false);
                navigate(`/ad/${data._id}`);
            })
            .catch(err => {
                setSaving(false);
                setError(err.message);
            });
    };


    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input className="form-control" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input className="form-control" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" disabled={saving}> {saving ? 'Saving...' : 'Submit'}</button>
                </div>



            </form>
        </div>
    );
}

export default EditAd;