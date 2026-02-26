import React, { useState } from 'react';
import { Wifi, Cpu, Monitor, Camera, HardDrive, Settings, DollarSign, ChevronDown } from 'lucide-react';

const SidebarFilters = () => {
    // Hover State
    const [openSections, setOpenSections] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});

    const toggleSection = (sectionId) => {
        setOpenSections(sectionId ? { [sectionId]: true } : {});
    };

    const toggleFilter = (categoryId, groupTitle, option) => {
        const selectionId = `${categoryId}-${groupTitle}`;
        setSelectedFilters(prev => {
            const categoryFilters = prev[selectionId] || [];
            if (categoryFilters.includes(option)) {
                return {
                    ...prev,
                    [selectionId]: categoryFilters.filter(item => item !== option)
                };
            } else {
                return {
                    ...prev,
                    [selectionId]: [...categoryFilters, option]
                };
            }
        });
    };

    const resetFilters = () => {
        setSelectedFilters({});
    };

    const handleApplyFilters = () => {
        console.log('Applying Filters:', selectedFilters);
        // You can add logic here to filter data
    };

    const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12 GB', '16GB', '32GB'];
    const storageOptions = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
    const networkOptions = ['2G', '3G', '4G', '5G'];
    const screenOptions = ['AMOLED', 'OLED', 'Super AMOLED', 'IPS LCD', 'LTPO', 'Retina'];
    const cameraOptions = ['8MP', '12MP', '16MP', '32MP', '48MP', '50MP', '64MP', '108MP'];
    const osOptions = ['Android', 'iOS', 'HarmonyOS', 'Windows'];
    const priceOptions = ['Under 20k', '20k-40k', '40k-60k', '60k-100k', 'Above 100k'];

    const renderFilterContent = (categoryId, options) => (
        <div className="p-1 bg-[#EDF6F9] flex flex-col gap-2">
            {[
                { title: 'Phones', opts: options },
                { title: 'Tabs', opts: options },
                { title: 'Watches', opts: options }
            ].map((group, idx) => (
                <div key={idx} className="overflow-hidden">
                    <div className="relative flex items-end">
                        {/* Horizontal Support Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#0580A5]"></div>
                        {/* Clipped Header Box */}
                        <div
                            className="border border-[#0580A5] bg-[#0580A5] text-white text-[13px] font-semibold px-2 pr-7 py-0.5 w-fit relative z-10"
                            style={{ clipPath: 'polygon(0% 0%, calc(100% - 25px) 0%, 100% 100%, 0% 100%)' }}
                        >
                            {group.title}
                        </div>
                    </div>
                    <div className="border border-[#0580A5] px-3 py-3 flex flex-wrap gap-x-2 gap-y-1">
                        {group.opts.map((opt, i) => {
                            const selectionId = `${categoryId}-${group.title}`;
                            const isSelected = selectedFilters[selectionId]?.includes(opt);
                            return (
                                <span
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFilter(categoryId, group.title, opt);
                                    }}
                                    className={`text-md cursor-pointer font-normal whitespace-nowrap px-2 py-0.5 rounded transition-colors ${isSelected
                                        ? 'bg-[#0580A5] text-white'
                                        : 'text-black hover:text-white hover:bg-[#0580A5]'
                                        }`}
                                >
                                    {opt}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    const filters = [
        { id: 'network', label: 'Search by Network', icon: <Wifi size={20} />, content: renderFilterContent('network', networkOptions) },
        { id: 'ram', label: 'Search by RAM', icon: <Cpu size={20} />, content: renderFilterContent('ram', ramOptions) },
        { id: 'screen', label: 'Search by Screen', icon: <Monitor size={20} />, content: renderFilterContent('screen', screenOptions) },
        { id: 'camera', label: 'Search by Camera', icon: <Camera size={20} />, content: renderFilterContent('camera', cameraOptions) },
        { id: 'storage', label: 'Search by Storage', icon: <HardDrive size={20} />, content: renderFilterContent('storage', storageOptions) },
        { id: 'os', label: 'Search by OS', icon: <Settings size={20} />, content: renderFilterContent('os', osOptions) },
        { id: 'price', label: 'Search by Price', icon: <DollarSign size={20} />, content: renderFilterContent('price', priceOptions) },
    ];

    const totalSelected = Object.values(selectedFilters).flat().length;

    return (
        <div className="flex flex-col gap-1">
            {filters.map((filter) => (
                <div
                    key={filter.id}
                    className="w-full group"
                    onMouseEnter={() => {
                        if (window.innerWidth >= 768) toggleSection(filter.id);
                    }}
                    onMouseLeave={() => {
                        if (window.innerWidth >= 768) toggleSection(null);
                    }}
                    onClick={() => {
                        if (window.innerWidth < 768) {
                            toggleSection(openSections[filter.id] ? null : filter.id);
                        }
                    }}
                >
                    <button
                        className={`w-full flex hover:cursor-pointer items-center justify-between px-4 py-3 text-white transition-colors bg-[#0580A5] border-b border-[#0891b2]/30 hover:bg-[#0891b2]`}
                    >
                        <div className="flex items-center gap-3 ">
                            {filter.icon}
                            <span className="font-medium text-lg">{filter.label}</span>
                            {(() => {
                                const groupCount = ['Phones', 'Tabs', 'Watches'].reduce((sum, title) => {
                                    return sum + (selectedFilters[`${filter.id}-${title}`]?.length || 0);
                                }, 0);
                                return groupCount > 0 ? (
                                    <span className="bg-white text-[#0580A5] text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                                        {groupCount}
                                    </span>
                                ) : null;
                            })()}
                        </div>
                        <ChevronDown
                            size={20}
                            className={`transform transition-transform duration-500 ${openSections[filter.id] ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>

                    {/* Expanded Content with Smooth Animation */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections[filter.id]
                            ? 'max-h-[1000px] opacity-100'
                            : 'max-h-0 opacity-0'
                            }`}
                    >
                        {filter.content}
                    </div>
                </div>
            ))}

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                    onClick={handleApplyFilters}
                    className="hover:cursor-pointer bg-[#0580A5] text-white font-medium py-3 hover:bg-[#0891b2] transition-colors flex items-center justify-center gap-2"
                >
                    Apply Filters {totalSelected > 0 && `(${totalSelected})`}
                </button>
                <button
                    onClick={resetFilters}
                    className="hover:cursor-pointer bg-[#0580A5] text-white font-medium py-3 hover:bg-[#0891b2] transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default SidebarFilters;
