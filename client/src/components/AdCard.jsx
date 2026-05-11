import { Link } from 'react-router-dom';

const AdCard = ({ ad }) => {
    return (
        <div className="card h-100">
            {ad.image && (
                <img className="card-img-top" src={`${import.meta.env.VITE_API_URL}${ad.image}`} />
            )}
            <div className="card-body">
                <h5 className="card-title">
                    <Link to={`/ad/${ad._id}`} >
                        {ad.title}
                    </Link>
                </h5>
                <p className="cart-text">{ad.price}</p>
                <p className="card-text">{ad.location}</p>
            </div>
        </div>

    )
};



export default AdCard;