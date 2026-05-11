import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdCard from "../components/AdCard";

const Search = () => {
    const { phrase } = useParams();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/ads/search/${phrase}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setAds(data);
                setLoading(false);
            });
    }, [phrase]);

    if (loading) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className="container mt-4">
            <h1>Search results for: {phrase}</h1>
            {ads.length === 0 && (
                <h2>No ads found</h2>
            )}
            <div className="row">
                {ads.map(ad => (
                    <div key={ad._id} className="col-12 col-md-6 col-lg-4">
                        <AdCard ad={ad} />
                    </div>
                ))}

            </div>
        </div>
    );
};


export default Search;