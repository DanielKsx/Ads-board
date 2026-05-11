import { useState, useEffect } from "react";
import AdCard from "../components/AdCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [ads, setAds] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/ads`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setAds(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchPhrase}`);
    };
    return (
        <div className="container">
            <form onSubmit={handleSearch} className="mb-4">
                <div className="row">
                    <div className="col-10">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search..."
                            value={searchPhrase}
                            onChange={(e) => setSearchPhrase(e.target.value)}
                        />
                    </div>

                    <div className="col-2">
                        <button className="btn btn-primary w-100">
                            Search
                        </button>
                    </div>
                </div>
            </form>
            <div className="row">
                {ads.map(ad =>
                    <div key={ad._id} className="col-12 col-md-6 col-lg-4">
                        <AdCard ad={ad} />
                    </div>
                )})
            </div>
        </div>
    );
};

export default Home;