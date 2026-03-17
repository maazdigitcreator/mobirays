import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import ReviewedProductsList from '../components/ReviewedProductsList';

const ReviewedProducts = () => {
    return (
        <div className=" grid grid-cols-12">
            <DashboardSidebar />

            <div className='col-span-9 px-2 pb-15 border-b-2 border-[#0580A5]'>
                <div>
                    <ReviewedProductsList />
                </div>
            </div>
        </div>
    );
};

export default ReviewedProducts;
