import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/useData";
import { getProductDetailPath } from "../../utils/productRoutes";

const getProductTimestamp = (product) => {
  const candidateValues = [
    product?.created_at,
    product?.release_date,
    product?.released,
    product?.date,
  ];

  for (const value of candidateValues) {
    const timestamp = Date.parse(value);
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return 0;
};

const isMobilePhone = (product) => {
  const category = String(product?.product_category || "").toLowerCase();
  return category.includes("mobile") || category.includes("phone");
};

const SidebarLatestModels = () => {
  const { allProducts, loading, error } = useData();

  const latestMobilePhones = useMemo(
    () =>
      [...allProducts]
        .filter(
          (product) =>
            product &&
            Number.isFinite(Number(product.id)) &&
            Number(product.id) > 0 &&
            isMobilePhone(product),
        )
        .sort((leftProduct, rightProduct) => {
          const timestampDifference =
            getProductTimestamp(rightProduct) -
            getProductTimestamp(leftProduct);

          if (timestampDifference !== 0) {
            return timestampDifference;
          }

          return Number(rightProduct.id) - Number(leftProduct.id);
        })
        .slice(0, 8),
    [allProducts],
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between bg-[#0580A5] px-4 py-2 text-lg text-white">
        <span>Latest Mobile Phone Models</span>
      </div>
      <div className="text-sm">
        {loading ? (
          <div className="bg-white px-4 py-4 text-gray-600">Loading...</div>
        ) : error ? (
          <div className="bg-white px-4 py-4 text-red-700">{error}</div>
        ) : latestMobilePhones.length === 0 ? (
          <div className="bg-white px-4 py-4 text-gray-600">
            No mobile phone models available.
          </div>
        ) : (
          latestMobilePhones.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center justify-between px-4 py-2 ${
                index % 2 === 0 ? "bg-[#67afc5]" : "bg-white"
              }`}
            >
              <div className="flex gap-2">
                <span className="text-gray-600">{index + 1}.</span>
                <Link
                  to={getProductDetailPath(product)}
                  state={{ product }}
                  className="font-medium text-gray-700 transition-colors hover:text-[#0580A5]"
                >
                  {product.name}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarLatestModels;
