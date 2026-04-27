import {
    Wifi,
    Cpu,
    Monitor,
    Camera,
    HardDrive,
    Settings,
    DollarSign,
    Database,
    MonitorSmartphone,
} from 'lucide-react';
import { useSidebarFilters } from '../../hooks/useSidebarFilters';

const FILTER_ICONS = {
    network: Wifi,
    screen: Monitor,
    camera: Camera,
    storage: HardDrive,
    os: Settings,
    price: DollarSign,
    ram: Database,
    display: MonitorSmartphone,
};

const SidebarFilters = () => {
    const {
        filters,
        openSections,
        selectedFilters,
        status,
        totalSelected,
        toggleSection,
        toggleFilter,
        resetFilters,
        handleApplyFilters,
    } = useSidebarFilters();

    const renderFilterContent = (filter) => (
        <div className="p-1 bg-[#EDF6F9] flex flex-col gap-2">
            {filter.groups.map((group) => (
                <div key={`${filter.id}-${group.title}`} className="overflow-hidden">
                    <div className="relative flex items-end">
                        <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#0580A5]"></div>
                        <div
                            className="border border-[#0580A5] bg-[#0580A5] text-white text-[13px] font-semibold px-2 pr-7 py-0.5 w-fit relative z-10"
                            style={{ clipPath: 'polygon(0% 0%, calc(100% - 25px) 0%, 100% 100%, 0% 100%)' }}
                        >
                            {group.title}
                        </div>
                    </div>
                    <div className="border border-[#0580A5] px-3 py-3 flex flex-wrap gap-x-2 gap-y-1">
                        {group.options.map((option) => {
                            const selectionId = `${filter.id}-${group.categoryId}`;
                            const isSelected = selectedFilters[selectionId]?.includes(option);

                            return (
                                <span
                                    key={`${selectionId}-${option}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFilter(filter.id, group.categoryId, option);
                                    }}
                                    className={`text-md cursor-pointer font-normal whitespace-nowrap px-2 py-0.5 rounded transition-colors ${isSelected
                                        ? 'bg-[#0580A5] text-white'
                                        : 'text-black hover:text-white hover:bg-[#0580A5]'
                                        }`}
                                >
                                    {option}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-1">
            {status.error && (
                <div className="border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                    {status.error}
                </div>
            )}

            {filters.map((filter) => {
                const Icon = FILTER_ICONS[filter.id] || Settings;
                const groupCount = filter.groups.reduce((sum, group) => (
                    sum + (selectedFilters[`${filter.id}-${group.categoryId}`]?.length || 0)
                ), 0);

                return (
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
                            className="w-full flex hover:cursor-pointer items-center justify-between text-white transition-colors bg-[#0580A5] border-b border-[#0891b2]/30 hover:bg-[#0891b2]"
                        >
                            <div className="flex items-center gap-3">
                                <span className='bg-[#03708F] p-3'>
                                    <Icon size={20} />
                                </span>
                                <span className="font-medium text-lg">{filter.label}</span>
                                {groupCount > 0 ? (
                                    <span className="bg-white text-[#0580A5] text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                                        {groupCount}
                                    </span>
                                ) : null}
                            </div>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections[filter.id]
                                ? 'max-h-[1000px] opacity-100'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            {renderFilterContent(filter)}
                        </div>
                    </div>
                );
            })}

            {!status.loading && filters.length === 0 && !status.error && (
                <div className="border border-[#0580A5] bg-[#EDF6F9] px-3 py-4 text-sm text-gray-600">
                    No filters available.
                </div>
            )}

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
