import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AddAd = ({ user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to="/" />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);
        formData.append('location', location);
        formData.append('price', price);
        formData.append('image', image);

        setLoading(true);
        setError('');

        fetch(`${import.meta.env.VITE_API_URL}/api/ads`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.message || 'Adding ad failed');
                    });
                }
                return res.json();
            })
            .then(data => {
                setLoading(false);
                navigate(`/ad/${data._id}`);
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
            <form onSubmit={handleSubmit}>
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
                    <button className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Submit'}</button>
                </div>



            </form>
        </div>
    );
}

export default AddAd;