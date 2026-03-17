import React from 'react';
import WishlistProducts from '../components/WishlistProducts';
import DashboardPageLayout from '../components/DashboardPageLayout';

const Wishlist = () => {
    return (
        <DashboardPageLayout>
            <WishlistProducts />
        </DashboardPageLayout>
    );
};

export default Wishlist;
