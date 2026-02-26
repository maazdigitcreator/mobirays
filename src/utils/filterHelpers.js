export const filterProductsByCategory = (products, category) => {
    if (!category) return products;
    if (!products) return [];

    return products.filter(product => {
        const prodCat = product.product_category ? product.product_category.toLowerCase() : '';
        const targetCat = category.toLowerCase();

        // Flexible matching
        if (targetCat === 'smartwatches' || targetCat === 'watch' || targetCat === 'watches') {
            return prodCat.includes('watch');
        }
        if (targetCat === 'tablets' || targetCat === 'tabs' || targetCat === 'tablet') {
            return prodCat.includes('tab') || prodCat.includes('pad');
        }
        if (targetCat === 'mobile phones' || targetCat === 'mobiles' || targetCat === 'phones') {
            return prodCat.includes('mobile') || prodCat.includes('phone');
        }

        return prodCat.includes(targetCat);
    });
};
