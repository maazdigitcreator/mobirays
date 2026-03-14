import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import DeviceComparisonCard from '../components/DeviceComparisonCard';
import ComparisonTable from '../components/ComparisonTable';
import HeroBanner from '../components/Layout/HeroBanner';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
const Comparison = () => {
    // Sample device data - replace with API data later
    const location = useLocation();

    const [bannerUrl, setBannerUrl] = useState('');

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const banner = allBanners.find(b => b.location === 'comparison_banner_1');
                if (banner && banner.image) {
                    setBannerUrl(banner.image);
                }
            } catch (error) {
                console.error("Error fetching comparison banner:", error);
            }
        };
        fetchBanner();
    }, []);

    // Helper to transform API data to comparison format
    const transformApiDataToDevice = (apiData) => {
        if (!apiData) return null;
        const specs = apiData.specifications || {};
        const prices = apiData.price || {};
        const moreSpecs = apiData.more_specifications || [];

        // Group more_specifications by attribute (Category)
        const groupedSpecs = {};
        moreSpecs.forEach(spec => {
            if (!groupedSpecs[spec.attribute]) {
                groupedSpecs[spec.attribute] = [];
            }
            groupedSpecs[spec.attribute].push({
                label: spec.value,
                value: spec.description
            });
        });

        // Ensure we have at least standard grouping if more_specifications is missing (fallback)
        if (Object.keys(groupedSpecs).length === 0) {
            // ... (We could keep the old manual mapping here as fallback, or just trust the API)
        }

        return {
            id: apiData.id || Date.now(),
            name: apiData.name || "Unknown Device",
            slug: apiData.slug, // Pass slug for navigation
            originalData: apiData, // Pass full data for navigation state
            image: apiData.image || "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-note20-5g.jpg",
            ram: specs.ram || "N/A",
            storage: specs.storage || "N/A",
            price: prices.pkr ? `Rs ${prices.pkr}` : (prices.usd ? `$${prices.usd}` : (prices.inr ? `₹${prices.inr}` : "N/A")),
            groupedSpecs: groupedSpecs, // New dynamic structure
            specs: { // Keep this for Card display (ram, storage, etc.)
                display: specs?.display_size ? specs.display_size.replace(/\s*Inches?/i, '') : "N/A",
                displayResolution: specs?.display_resolution || "N/A",
                camera: specs?.camera || "N/A",
                cameraVideo: specs?.video || "N/A",
                ram: specs?.ram || "N/A",
                chipset: specs?.chipset || "N/A",
                battery: specs?.battery || "N/A",
                batteryType: specs?.battery_type || "N/A",
                os: specs?.os || "N/A",
                storage: specs?.storage || "N/A",
                dimensions: specs?.body || specs?.dimensions || "N/A",
                weight: specs?.weight || "N/A",
                sim: specs?.sim || "N/A",
                build: specs?.build || "N/A",
                wlan: specs?.wlan || "N/A",
                bluetooth: specs?.bluetooth || "N/A",
                gps: specs?.gps || "N/A",
                nfc: specs?.nfc || "N/A",
                radio: specs?.radio || "N/A",
                usb: specs?.usb || "N/A",
                sensors: specs?.sensors || "N/A",
                charging: specs?.charging || "N/A",
                jack: specs?.jack_3_5mm || "N/A",
                loudspeaker: specs?.loudspeaker || "N/A"
            }
        };
    };

    // Initialize devices validation
    const [devices, setDevices] = useState(() => {
        if (location.state?.rawDeviceData) {
            return [transformApiDataToDevice(location.state.rawDeviceData)];
        } else if (location.state?.deviceToCompare) {
            const partial = location.state.deviceToCompare;
            return [{
                ...partial,
                specs: {
                    ...partial.specs,
                    weight: partial.specs.weight || "N/A",
                    build: partial.specs.build || "N/A",
                }
            }];
        }
        // Return dummy data if no device passed (for testing) or empty array
        // Return empty array if no device passed
        return [];
    });

    const [searchInputs, setSearchInputs] = useState(() => {
        const inputs = ['', '', ''];
        if (location.state?.deviceToCompare) {
            inputs[0] = location.state.deviceToCompare.name;
        }
        return inputs;
    });

    // State for all available products (for search)
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState({ 0: [], 1: [], 2: [] });
    const [activeSearchIndex, setActiveSearchIndex] = useState(null);

    // Fetch all products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/products/allProducts`);
                const data = await response.json();
                if (data && data.data) {
                    setAllProducts(data.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleSearchChange = (index, value) => {
        const newInputs = [...searchInputs];
        newInputs[index] = value;
        setSearchInputs(newInputs);

        // Filter suggestions
        if (value.length > 0) {
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5); // Limit to 5 suggestions

            setSuggestions(prev => ({ ...prev, [index]: filtered }));
            setActiveSearchIndex(index);
        } else {
            setSuggestions(prev => ({ ...prev, [index]: [] }));
            setActiveSearchIndex(null);
        }
    };

    const handleSelectProduct = (index, product) => {
        // Transform the selected product
        const transformedDevice = transformApiDataToDevice(product);

        // Update inputs
        const newInputs = [...searchInputs];
        newInputs[index] = product.name;
        setSearchInputs(newInputs);

        // Clear suggestions
        setSuggestions(prev => ({ ...prev, [index]: [] }));
        setActiveSearchIndex(null);

        // Update devices array logic:
        // If index exists in current devices, replace it.
        // If index is outside current length, add it.
        // But devices array corresponds to slots [0, 1, 2].
        // We need to ensure the device at `index` is set.

        setDevices(prevDevices => {
            const newDevices = [...prevDevices];
            // If the array is shorter than the index we are setting, fill with nulls/undefined 
            // (though in our UI logic we map [0,1,2] so we should probably keep array sparse or filled)

            // Actually, we want to maintain the list of active comparison devices.
            // If we have 1 device (at index 0) and user searches in slot 1, we add a 2nd device.
            // If user searches in slot 0, we replace the 1st device.

            if (index < newDevices.length) {
                newDevices[index] = transformedDevice;
            } else {
                // Determine how many nulls to add if skipping (unlikely with this UI)
                while (newDevices.length < index) {
                    newDevices.push(null);
                }
                newDevices.push(transformedDevice);
            }
            // Filter out empty slots if any logic created them, but we want to allow replacing distinct slots
            // For properly working with the grid, we might just want to ensure `devices[index]` is set.
            return newDevices;
        });
    };

    const handleSearch = (index) => {
        // TODO: Implement search functionality with API if needed (e.g. enter key)
    };

    // Get grid columns class based on number of devices
    const getGridCols = () => {
        // We always want 3 columns layout logic for the grid container to match headers
        // But for the cards container, usage might vary.
        // Let's stick to the existing logic which seems to be dynamic.
        if (devices.length === 1) return "grid-cols-1";
        if (devices.length === 2) return "grid-cols-1 md:grid-cols-2";
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    };

    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-2">
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarBrands />
                        <SidebarBanner1 />
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-2/3">

                    <HeroBanner />
                    <div className="relative w-full mb-2 overflow-hidden">
                        {/* Background bar */}
                        <div className="w-full h-10 sm:h-14 flex items-center justify-between">
                            {/* Left side - Device name with slanted edge */}
                            <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            <div className="relative w-full flex items-end">
                                {/* Title Box */}
                                <div
                                    className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                                >
                                    <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">Compare Specification</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Boxes Section */}
                    <div className={`grid grid-cols-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 px-2`}>
                        {[0, 1, 2].map((index) => ( // Always show 3 search boxes
                            <div key={index} className="relative">
                                {/* Header */}
                                <div className=" py-2 ">
                                    <h3 className="text-sm text-black">COMPARE WITH</h3>
                                </div>

                                {/* Search Input */}
                                <div className="">
                                    <div className="flex gap-2 grid grid-cols-12">
                                        <input
                                            type="text"
                                            placeholder="Please enter mobile name"
                                            value={searchInputs[index]}
                                            onChange={(e) => handleSearchChange(index, e.target.value)}
                                            onFocus={() => setActiveSearchIndex(index)}
                                            className="col-span-8 flex-1 border-2 border-[#087FA5] px-1 py-1 text-sm focus:outline-none focus:border-[#0580A5]"
                                        />
                                        <button
                                            onClick={() => handleSearch(index)}
                                            className="col-span-4 bg-[#0580A5] text-white py-1 text-sm font-semibold hover:bg-[#046a8a] transition-colors cursor-pointer"
                                        >
                                            SEARCH
                                        </button>
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {activeSearchIndex === index && suggestions[index] && suggestions[index].length > 0 && (
                                        <div className="absolute top-[75px] left-0 w-full bg-white border border-gray-300 shadow-lg z-50">
                                            {suggestions[index].map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={() => handleSelectProduct(index, product)}
                                                >
                                                    {product.image && (
                                                        <img src={product.image} alt="" className="w-8 h-8 object-contain" />
                                                    )}
                                                    <span className="text-sm">{product.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs text-[#41403E] mt-2 flex items-center gap-1">
                                        <span className="inline-block w-4 h-4 bg-[#41403E] rounded-full text-white text-center leading-4 text-xs">i</span>
                                        Please enter model name
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Device Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 px-2">
                        {[0, 1, 2].map((index) => {
                            const device = devices[index];
                            return device ? (
                                <DeviceComparisonCard key={device.id || index} device={device} />
                            ) : (
                                <div key={index} className="hidden lg:block"></div> // Placeholder for empty slot
                            );
                        })}
                    </div>


                </div>


            </div>
            <div className="w-full">
                {/* Comparison Table */}
                {devices.length > 0 && (
                    <ComparisonTable devices={devices} />
                )}
            </div>

            {bannerUrl && (
                <div className="md:col-span-3 mb-6 overflow-hidden">
                    <img className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' src={bannerUrl} alt="Comparison Banner" />
                </div>
            )}
        </div>
    );
};

export default Comparison;
