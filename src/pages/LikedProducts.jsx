import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import LikedProductsList from '../components/LikedProductsList';

const LikedProducts = () => {
    return (
        <div className=" grid grid-cols-12">
            <DashboardSidebar />

            <div className='col-span-9 px-2 border-b-2 border-[#0580A5]'>
                <div>
                    <LikedProductsList />
                </div>
            </div>
        </div>
    );
};

export default LikedProducts;
