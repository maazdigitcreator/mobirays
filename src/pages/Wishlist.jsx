import React, { useState } from 'react';
import WishlistProducts from '../components/WishlistProducts';
import DashboardSidebar from '../components/DashboardSidebar';

const Wishlist = () => {

    return (
        <div className=" grid grid-cols-12">
            <DashboardSidebar />

            <div className='col-span-9 px-2 border-b-2 border-[#0580A5]'>


                <div>

                    <WishlistProducts />
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
