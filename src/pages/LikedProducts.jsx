import React from 'react';
import DashboardPageLayout from '../components/DashboardPageLayout';
import LikedProductsList from '../components/LikedProductsList';

const LikedProducts = () => {
    return (
        <DashboardPageLayout>
            <LikedProductsList />
        </DashboardPageLayout>
    );
};

export default LikedProducts;
