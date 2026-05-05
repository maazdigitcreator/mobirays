import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';
import SingleReview from '../SingleReview';

const RelatedReviews = ({ productName }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/reviews/allReviews`);
                const data = await response.json();
                if (data && data.data) {
                    setReviews(data.data);
                }
            } catch (error) {
                console.error('Error fetching related reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return <div className="text-center py-4 text-white">Loading...</div>;
    }

    // Filter: only show reviews where is_products === 1 and products matches the current product name
    const displayReviews = productName
        ? reviews.filter(r =>
            r.is_products === 1 &&
            r.products &&
            r.products.toLowerCase() === productName.toLowerCase()
        )
        : [];

    return (
        <div>
            <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                Related Reviews
            </div>
            <div>
                {displayReviews.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4 px-2">
                        This product has no reviews yet.
                    </p>
                ) : (
                    <>
                        <div className='grid grid-cols-2 gap-2 mt-2'>
                            {displayReviews.slice(0, 4).map((review) => {
                                const rating = (parseFloat(review.rating) || 0);
                                const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';

                                return (
                                    <Link key={review.id} to={`/review/${slug}`} state={{ reviewData: review }}>
                                        <SingleReview
                                            title={review.name}
                                            rating={Math.min(rating, 10)}
                                            image={review.image}
                                            customHeight="h-[120px] sm:h-[150px]"
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        <Link to="/reviews" className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center mt-3">
                            <span className="bg-white border-2 rounded-full border-[#0580A5] px-10 py-2 z-10 hover:cursor-pointer">Show More &gt;&gt;</span>
                            <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default RelatedReviews;
