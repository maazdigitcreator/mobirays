import { useEffect, useMemo, useState } from 'react';
import HeroBanner from '../components/Layout/HeroBanner';

import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import { useData } from '../context/useData';
import { useAdvancedSearchAttributes } from '../hooks/useAdvancedSearchAttributes';
import LatestProducts from '../components/LatestProducts';

/* ────────────── Section Header ────────────── */
const SectionHeader = ({ title }) => (
    <div
        className="px-4 py-2.5 text-white font-medium text-xl"
        style={{
            background: 'linear-gradient(to right, #0580A5 0%, #3a9dbc 30%, #7ec4d9 60%, #c5e5ef 80%, #ffffff 100%)',
        }}
    >
        {title}
    </div>
);

/* ────────────── Dual Range Slider Styles (injected once) ────────────── */
const sliderCSS = `
.dual-range-wrap { position: relative; height: 24px; display: flex; align-items: center; width: 100%; }
.dual-range-wrap input[type=range] {
  -webkit-appearance: none; appearance: none;
  position: absolute; width: 100%; height: 4px;
  background: transparent; pointer-events: none; margin: 0; top: 50%; transform: translateY(-50%);
  z-index: 10;
}
.dual-range-wrap .range-min { z-index: 11; }
.dual-range-wrap .range-max { z-index: 12; }
.dual-range-wrap .range-min.on-top { z-index: 13; }

/* Hide default track background since we use a custom one */
.dual-range-wrap input[type=range]::-webkit-slider-runnable-track { height: 4px; background: transparent; }
.dual-range-wrap input[type=range]::-moz-range-track { height: 4px; background: transparent; }

.dual-range-wrap input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 16px; height: 16px; border-radius: 50%;
  background: #0580A5; border: 3px solid #b0dde9;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
  cursor: pointer; pointer-events: auto;
  margin-top: -6px; /* (Track height 4px / 2) - (Thumb height 16px / 2) = -6px */
}
.dual-range-wrap input[type=range]::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: #0580A5; border: 3px solid #b0dde9;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
  cursor: pointer; pointer-events: auto;
  border: none; /* Firefox specific fix */
}

.slider-track {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 100%; height: 4px; background: #e0e0e0; border-radius: 4px; z-index: 1;
}
.slider-highlight {
  position: absolute; top: 50%; transform: translateY(-50%);
  height: 4px; background: #034D63; border-radius: 4px; z-index: 2;
}
`;

// Inject CSS once
if (typeof document !== 'undefined' && !document.getElementById('dual-range-css')) {
    const style = document.createElement('style');
    style.id = 'dual-range-css';
    style.textContent = sliderCSS;
    document.head.appendChild(style);
}

/* ────────────── Dropdown Component ────────────── */
const Dropdown = ({ label, value, onChange, options, placeholder = '' }) => (
    <div className="flex items-center bg-white border border-[#0580A5] ">
        <span className="text-md uppercase tracking-wide px-3 py-[8px] whitespace-nowrap">
            {label}:
        </span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-md py-[8px] px-3 outline-none bg-transparent border-none cursor-pointer appearance-none"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '30px',
            }}
        >
            <option value="">{placeholder || ''}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

/* ────────────── Checkbox Row ────────────── */
const CheckboxRow = ({ label, checked, onChange }) => (
    <div
        className="flex items-center justify-between bg-white border border-[#0580A5] px-3 py-[8px] cursor-pointer select-none"
        onClick={() => onChange(!checked)}
    >
        <span className="text-md uppercase tracking-wide whitespace-nowrap">{label}:</span>
        <div className={`w-[18px] h-[18px] border-2 flex items-center justify-center transition-colors ${checked ? 'bg-[#0580A5] border-[#0580A5]' : 'border-gray-400 bg-white'
            }`}>
            {checked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            )}
        </div>
    </div>
);

/* ────────────── Slider Row with Min/Max inputs ────────────── */
const SliderRow = ({ label, minValue, maxValue, onMinChange, onMaxChange, min = 0, max = 100 }) => {
    const numMin = parseFloat(String(minValue).replace(/[^0-9.]/g, '')) || min;
    const numMax = parseFloat(String(maxValue).replace(/[^0-9.]/g, '')) || max;
    const clampedMin = Math.max(min, Math.min(numMin, max));
    const clampedMax = Math.max(min, Math.min(numMax, max));
    const mid = (min + max) / 2;
    return (
        <div className="flex items-center border border-[#0580A5]">
            <span className="text-md uppercase tracking-wide px-2 py-[7px] whitespace-nowrap min-w-[70px]">
                {label}:
            </span>
            <div className="flex items-center flex-1 gap-1 px-1">
                <input
                    type="text"
                    value={minValue}
                    onChange={(e) => onMinChange(e.target.value)}
                    placeholder="Min"
                    className="w-[50px] text-[11px] text-center py-[5px] outline-none text-black font-normal"
                />
                <div className="flex-1 dual-range-wrap">
                    <div className="slider-track"></div>
                    <div
                        className="slider-highlight"
                        style={{
                            left: `${((clampedMin - min) / (max - min)) * 100}%`,
                            width: `${((clampedMax - clampedMin) / (max - min)) * 100}%`
                        }}
                    ></div>
                    <input
                        type="range"
                        className={`range-min${clampedMin >= mid ? ' on-top' : ''}`}
                        min={min}
                        max={max}
                        value={clampedMin}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            onMinChange(String(Math.min(v, clampedMax)));
                        }}
                    />
                    <input
                        type="range"
                        className="range-max"
                        min={min}
                        max={max}
                        value={clampedMax}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            onMaxChange(String(Math.max(v, clampedMin)));
                        }}
                    />
                </div>
                <input
                    type="text"
                    value={maxValue}
                    onChange={(e) => onMaxChange(e.target.value)}
                    placeholder="Max"
                    className="w-[50px] text-[11px] text-center py-[5px] outline-none text-black font-normal"
                />
            </div>
        </div>
    );
};

/* ────────────── Slider with label + value inputs (like YEARS / PRICE)  ────────────── */
const LabelSliderRow = ({ label, minValue, maxValue, onMinChange, onMaxChange, prefix = '', min = 0, max = 3000 }) => {
    const numMin = parseFloat(String(minValue).replace(/[^0-9.]/g, '')) || min;
    const numMax = parseFloat(String(maxValue).replace(/[^0-9.]/g, '')) || max;
    const clampedMin = Math.max(min, Math.min(numMin, max));
    const clampedMax = Math.max(min, Math.min(numMax, max));
    const mid = (min + max) / 2;
    return (
        <div className="flex items-center border border-[#0580A5]">
            <span className="text-md uppercase tracking-wide px-2 py-[7px] whitespace-nowrap min-w-[60px]">
                {label}:
            </span>
            <span className="text-[11px] text-gray-500 px-1 whitespace-nowrap">{prefix}{minValue || '0'}</span>
            <div className="flex-1 dual-range-wrap">
                <div className="slider-track"></div>
                <div
                    className="slider-highlight"
                    style={{
                        left: `${((clampedMin - min) / (max - min)) * 100}%`,
                        width: `${((clampedMax - clampedMin) / (max - min)) * 100}%`
                    }}
                ></div>
                <input
                    type="range"
                    className={`range-min${clampedMin >= mid ? ' on-top' : ''}`}
                    min={min}
                    max={max}
                    value={clampedMin}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        onMinChange(prefix + String(Math.min(v, clampedMax)));
                    }}
                />
                <input
                    type="range"
                    className="range-max"
                    min={min}
                    max={max}
                    value={clampedMax}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        onMaxChange(prefix + String(Math.max(v, clampedMin)));
                    }}
                />
            </div>
            <span className="text-[11px] text-gray-500 px-1 whitespace-nowrap">{prefix}{maxValue || '0'}</span>
        </div>
    );
};

const sortOptions = (values) => [...values].sort((left, right) => left.localeCompare(right));

/* ═══════════════════ MAIN PAGE ═══════════════════ */
const AdvancedSearch = () => {
    const { allProducts, allBanners } = useData();
    const {
        brandOptions: apiBrandOptions,
        availabilityOptions: apiAvailabilityOptions,
        simSizeOptions: apiSimSizeOptions,
        status: attributesStatus,
    } = useAdvancedSearchAttributes();

    // ── filter state ──
    const [filters, setFilters] = useState({
        brand: '',
        availability: '',
        highRefreshRate: false,
        yearMin: '2008', yearMax: '2026',
        priceMin: '$158', priceMax: '$1650',
        network2g: '', network3g: '', network4g: '', network5g: '',
        simSize: '', simMultiple: '',
        formFactor: '', keyboard: '',
        heightMin: '', heightMax: '',
        widthMin: '', widthMax: '',
        thicknessMin: '', thicknessMax: '',
        weightMin: '', weightMax: '',
        ipCertificate: '', color: '',
        backMaterial: '', frameMaterial: '',
        os: '', osVersion: '',
        cpuSpeedMin: '', cpuSpeedMax: '',
        cpuCoresMin: '1', cpuCoresMax: '',
        chipset: '',
        gpuType: '',
        ramMin: '', ramMax: '',
        storageMin: '', storageMax: '',
        cardSlot: '',
        displayType: '',
        displaySizeMin: '', displaySizeMax: '',
        resolutionMin: '', resolutionMax: '',
        mainCameraMin: '', mainCameraMax: '',
        videoResolution: '',
        selfieCameraMin: '', selfieCameraMax: '',
        batteryMin: '', batteryMax: '',
        batteryType: '',
        charging: '',
        wlan: '', bluetooth: '', nfc: '',
        usbType: '',
        audioJack: '',
        sensors: '',
    });
    const [searchResults, setSearchResults] = useState(null);

    const bannerUrl = useMemo(() => {
        const banner = allBanners.find((item) => item.location === 'advancesearch_banner_1');
        return banner?.image || '';
    }, [allBanners]);

    const operatingSystems = useMemo(() => {
        const s = new Set();
        allProducts.forEach(p => {
            const os = p.specifications?.os || p.specifications?.operating_system;
            if (os) s.add(os);
        });
        return sortOptions([...s]);
    }, [allProducts]);

    const brandOptions = useMemo(() => sortOptions(apiBrandOptions), [apiBrandOptions]);

    const availabilityOptions = useMemo(() => sortOptions(apiAvailabilityOptions), [apiAvailabilityOptions]);

    const simSizeOptions = useMemo(() => sortOptions(apiSimSizeOptions), [apiSimSizeOptions]);

    useEffect(() => {
        if (attributesStatus.error) {
            console.error('Error fetching advanced search attributes:', attributesStatus.error);
        }
    }, [attributesStatus.error]);

    // ── helpers ──
    const set = (key) => (val) => setFilters(prev => ({ ...prev, [key]: val }));

    const parseNum = (str) => {
        if (!str) return null;
        const n = parseFloat(String(str).replace(/[^0-9.]/g, ''));
        return isNaN(n) ? null : n;
    };

    // ── search logic ──
    const handleSearch = () => {
        let results = [...allProducts];

        // Brand
        if (filters.brand) {
            results = results.filter(p =>
                (p.brand || p.specifications?.brand || '').toLowerCase() === filters.brand.toLowerCase()
            );
        }

        // OS
        if (filters.os) {
            results = results.filter(p => {
                const os = (p.specifications?.os || p.specifications?.operating_system || '').toLowerCase();
                return os.includes(filters.os.toLowerCase());
            });
        }

        // Price
        const priceMin = parseNum(filters.priceMin);
        const priceMax = parseNum(filters.priceMax);
        if (priceMin !== null || priceMax !== null) {
            results = results.filter(p => {
                const price = parseNum(p.price?.pkr || p.price?.usd || p.price);
                if (price === null) return true;
                if (priceMin !== null && price < priceMin) return false;
                if (priceMax !== null && price > priceMax) return false;
                return true;
            });
        }

        // Battery
        const batMin = parseNum(filters.batteryMin);
        const batMax = parseNum(filters.batteryMax);
        if (batMin !== null || batMax !== null) {
            results = results.filter(p => {
                const bat = parseNum(p.specifications?.battery || p.more_specifications?.battery);
                if (bat === null) return true;
                if (batMin !== null && bat < batMin) return false;
                if (batMax !== null && bat > batMax) return false;
                return true;
            });
        }

        // Display
        const dispMin = parseNum(filters.displaySizeMin);
        const dispMax = parseNum(filters.displaySizeMax);
        if (dispMin !== null || dispMax !== null) {
            results = results.filter(p => {
                const disp = parseNum(p.specifications?.display_size || p.specifications?.display);
                if (disp === null) return true;
                if (dispMin !== null && disp < dispMin) return false;
                if (dispMax !== null && disp > dispMax) return false;
                return true;
            });
        }

        // RAM
        const ramMin = parseNum(filters.ramMin);
        const ramMax = parseNum(filters.ramMax);
        if (ramMin !== null || ramMax !== null) {
            results = results.filter(p => {
                const ram = parseNum(p.specifications?.ram || p.more_specifications?.ram);
                if (ram === null) return true;
                if (ramMin !== null && ram < ramMin) return false;
                if (ramMax !== null && ram > ramMax) return false;
                return true;
            });
        }

        // Storage
        const storMin = parseNum(filters.storageMin);
        const storMax = parseNum(filters.storageMax);
        if (storMin !== null || storMax !== null) {
            results = results.filter(p => {
                const stor = parseNum(p.specifications?.storage || p.specifications?.internal_storage);
                if (stor === null) return true;
                if (storMin !== null && stor < storMin) return false;
                if (storMax !== null && stor > storMax) return false;
                return true;
            });
        }

        // Camera
        const camMin = parseNum(filters.mainCameraMin);
        const camMax = parseNum(filters.mainCameraMax);
        if (camMin !== null || camMax !== null) {
            results = results.filter(p => {
                const cam = parseNum(p.specifications?.camera || p.specifications?.main_camera);
                if (cam === null) return true;
                if (camMin !== null && cam < camMin) return false;
                if (camMax !== null && cam > camMax) return false;
                return true;
            });
        }

        // Weight
        const wMin = parseNum(filters.weightMin);
        const wMax = parseNum(filters.weightMax);
        if (wMin !== null || wMax !== null) {
            results = results.filter(p => {
                const w = parseNum(p.specifications?.weight || p.more_specifications?.weight);
                if (w === null) return true;
                if (wMin !== null && w < wMin) return false;
                if (wMax !== null && w > wMax) return false;
                return true;
            });
        }

        setSearchResults(results);
    };

    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarIntro />
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">
                    {/* Hero Banner */}
                    <HeroBanner />



                    {/* ═══════ Advanced Search Form ═══════ */}
                    <div className="bg-white overflow-hidden mb-8">

                        {/* Title */}
                        <div className="relative w-full flex items-end mb-4">
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>
                            <div className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10">
                                <h2 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">Advanced Search</h2>
                            </div>
                        </div>

                        {/* ─── General ─── */}
                        <SectionHeader title="General" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="BRAND" value={filters.brand} onChange={set('brand')} options={brandOptions} />
                                <LabelSliderRow label="YEARS" minValue={filters.yearMin} maxValue={filters.yearMax} onMinChange={set('yearMin')} onMaxChange={set('yearMax')} min={2000} max={2026} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="AVAILABILITY" value={filters.availability} onChange={set('availability')} options={availabilityOptions} />
                                <LabelSliderRow label="PRICE" minValue={filters.priceMin} maxValue={filters.priceMax} onMinChange={set('priceMin')} onMaxChange={set('priceMax')} prefix="$" min={0} max={5000} />
                            </div>
                        </div>

                        {/* ─── Network ─── */}
                        <SectionHeader title="Network" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                <Dropdown label="2G" value={filters.network2g} onChange={set('network2g')} options={['Yes', 'No']} />
                                <Dropdown label="3G" value={filters.network3g} onChange={set('network3g')} options={['Yes', 'No']} />
                                <Dropdown label="4G" value={filters.network4g} onChange={set('network4g')} options={['Yes', 'No']} />
                                <Dropdown label="5G" value={filters.network5g} onChange={set('network5g')} options={['Yes', 'No']} />
                            </div>
                        </div>

                        {/* ─── SIM ─── */}
                        <SectionHeader title="SIM" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="SIZE" value={filters.simSize} onChange={set('simSize')} options={simSizeOptions} />
                                <Dropdown label="MULTIPLE" value={filters.simMultiple} onChange={set('simMultiple')} options={['Single', 'Dual', 'Triple', 'Quad']} />
                            </div>
                        </div>

                        {/* ─── Body ─── */}
                        <SectionHeader title="Body" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="FORM FACTOR" value={filters.formFactor} onChange={set('formFactor')} options={['Bar', 'Slider', 'Flip', 'Foldable']} />
                                <Dropdown label="KEYBOARD" value={filters.keyboard} onChange={set('keyboard')} options={['Yes', 'No']} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="HEIGHT" minValue={filters.heightMin} maxValue={filters.heightMax} onMinChange={set('heightMin')} onMaxChange={set('heightMax')} />
                                <SliderRow label="WIDTH" minValue={filters.widthMin} maxValue={filters.widthMax} onMinChange={set('widthMin')} onMaxChange={set('widthMax')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="THICKNESS" minValue={filters.thicknessMin} maxValue={filters.thicknessMax} onMinChange={set('thicknessMin')} onMaxChange={set('thicknessMax')} />
                                <SliderRow label="WEIGHT" minValue={filters.weightMin} maxValue={filters.weightMax} onMinChange={set('weightMin')} onMaxChange={set('weightMax')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="IP CERTIFICATE" value={filters.ipCertificate} onChange={set('ipCertificate')} options={['IP67', 'IP68', 'IP69', 'None']} />
                                <Dropdown label="COLOR" value={filters.color} onChange={set('color')} options={['Black', 'White', 'Blue', 'Red', 'Green', 'Gold', 'Silver', 'Purple']} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="BACK MATERIAL" value={filters.backMaterial} onChange={set('backMaterial')} options={['Glass', 'Plastic', 'Metal', 'Ceramic', 'Leather']} />
                                <Dropdown label="FRAME MATERIAL" value={filters.frameMaterial} onChange={set('frameMaterial')} options={['Aluminum', 'Stainless Steel', 'Plastic', 'Titanium']} />
                            </div>
                        </div>

                        {/* ─── Platform ─── */}
                        <SectionHeader title="Platform" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="OS" value={filters.os} onChange={set('os')} options={operatingSystems} />
                                <Dropdown label="OS VERSION" value={filters.osVersion} onChange={set('osVersion')} options={[]} placeholder="Select an OS first" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="CPU SPEED" minValue={filters.cpuSpeedMin} maxValue={filters.cpuSpeedMax} onMinChange={set('cpuSpeedMin')} onMaxChange={set('cpuSpeedMax')} />
                                <SliderRow label="CPU CORES" minValue={filters.cpuCoresMin} maxValue={filters.cpuCoresMax} onMinChange={set('cpuCoresMin')} onMaxChange={set('cpuCoresMax')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="CHIPSET" value={filters.chipset} onChange={set('chipset')} options={['Snapdragon', 'MediaTek', 'Exynos', 'Apple A-series', 'Kirin', 'Dimensity', 'Tensor']} />
                                <Dropdown label="GPU" value={filters.gpuType} onChange={set('gpuType')} options={['Adreno', 'Mali', 'PowerVR', 'Apple GPU', 'Immortalis']} />
                            </div>
                        </div>

                        {/* ─── Memory ─── */}
                        <SectionHeader title="Memory" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="RAM" minValue={filters.ramMin} maxValue={filters.ramMax} onMinChange={set('ramMin')} onMaxChange={set('ramMax')} />
                                <SliderRow label="STORAGE" minValue={filters.storageMin} maxValue={filters.storageMax} onMinChange={set('storageMin')} onMaxChange={set('storageMax')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="CARD SLOT" value={filters.cardSlot} onChange={set('cardSlot')} options={['Yes', 'No']} />
                                <CheckboxRow label="HIGH REFRESH RATE" checked={filters.highRefreshRate} onChange={(val) => setFilters(prev => ({ ...prev, highRefreshRate: val }))} />
                            </div>
                        </div>

                        {/* ─── Display ─── */}
                        <SectionHeader title="Display" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="TYPE" value={filters.displayType} onChange={set('displayType')} options={['IPS LCD', 'AMOLED', 'Super AMOLED', 'OLED', 'LTPO OLED', 'TFT']} />
                                <SliderRow label="SIZE" minValue={filters.displaySizeMin} maxValue={filters.displaySizeMax} onMinChange={set('displaySizeMin')} onMaxChange={set('displaySizeMax')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="RESOLUTION" minValue={filters.resolutionMin} maxValue={filters.resolutionMax} onMinChange={set('resolutionMin')} onMaxChange={set('resolutionMax')} />
                            </div>
                        </div>

                        {/* ─── Camera ─── */}
                        <SectionHeader title="Camera" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="MAIN" minValue={filters.mainCameraMin} maxValue={filters.mainCameraMax} onMinChange={set('mainCameraMin')} onMaxChange={set('mainCameraMax')} />
                                <Dropdown label="VIDEO" value={filters.videoResolution} onChange={set('videoResolution')} options={['720p', '1080p', '4K', '8K']} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="SELFIE" minValue={filters.selfieCameraMin} maxValue={filters.selfieCameraMax} onMinChange={set('selfieCameraMin')} onMaxChange={set('selfieCameraMax')} />
                            </div>
                        </div>

                        {/* ─── Battery ─── */}
                        <SectionHeader title="Battery" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <SliderRow label="CAPACITY" minValue={filters.batteryMin} maxValue={filters.batteryMax} onMinChange={set('batteryMin')} onMaxChange={set('batteryMax')} />
                                <Dropdown label="TYPE" value={filters.batteryType} onChange={set('batteryType')} options={['Li-Ion', 'Li-Po', 'Silicon-Carbon']} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="CHARGING" value={filters.charging} onChange={set('charging')} options={['Yes', 'No', 'Wireless', 'Fast Charging']} />
                            </div>
                        </div>

                        {/* ─── Connectivity ─── */}
                        <SectionHeader title="Connectivity" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                <Dropdown label="WLAN" value={filters.wlan} onChange={set('wlan')} options={['Yes', 'No']} />
                                <Dropdown label="BLUETOOTH" value={filters.bluetooth} onChange={set('bluetooth')} options={['Yes', 'No']} />
                                <Dropdown label="NFC" value={filters.nfc} onChange={set('nfc')} options={['Yes', 'No']} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                <Dropdown label="USB" value={filters.usbType} onChange={set('usbType')} options={['USB Type-C', 'Micro-USB', 'Lightning']} />
                                <Dropdown label="3.5MM JACK" value={filters.audioJack} onChange={set('audioJack')} options={['Yes', 'No']} />
                            </div>
                        </div>

                        {/* ─── Sensors ─── */}
                        <SectionHeader title="Sensors" />
                        <div className="px-2 py-5 pb-10 space-y-1.5">
                            <div className="grid grid-cols-1 gap-1.5">
                                <Dropdown label="SENSORS" value={filters.sensors} onChange={set('sensors')} options={['Fingerprint', 'Face ID', 'Accelerometer', 'Gyroscope', 'Proximity', 'Compass', 'Barometer']} />
                            </div>
                        </div>

                        {/* ─── Result Count Bar ─── */}
                        <div className="flex items-center justify-center px-4 py-5 gap-3">
                            <span className="border border-2 border-[#0580A5] rounded-l-full px-4 py-1 text-3xl ">Result</span>
                            <span className="border border-2 border-[#0580A5] px-8 text-3xl py-1">99,522</span>
                            <button
                                onClick={handleSearch}
                                className="bg-[#0580A5] hover:bg-[#046a88] text-white border border-2 border-[#0580A5] font-light px-6 py-1 text-3xl transition-colors cursor-pointer rounded-r-full"
                            >
                                SHOW ALL
                            </button>
                        </div>


                    </div>

                    {/* ─── Disclaimer / Info Text ─── */}
                    <div className="leading-relaxed px-2 py-6 space-y-4">
                        <p>*PRICE BASED ON THE LOWEST ONLINE SIM-FREE PRICE, EXCLUDING TAXES, SUBSIDIES AND SHIPMENT. ONLY PHONES WITH KNOWN PRICES WILL APPEAR IN THE RESULTS.</p>
                        <p>*BATTERY STAND-BY AND TALK TIME BASED ON THE OFFICIAL MANUFACTURER SPECIFICATIONS, NOT ON REAL-LIFE TESTS</p>
                        <p>*IN FREE TEXT FIELD YOU CAN SEARCH FOR OTHER FEATURES, NOT MENTIONED ABOVE. FOR EXAMPLE - "FAST BATTERY CHARGING", "WIRELESS CHARGING", "POWER BANK", "ANT+", "GALILEO", "APTX" AND SO ON. IN SOME CASES IT CAN BE VERY USEFUL, BUT THE RESULTS ARE LESS RELIABLE.</p>
                    </div>

                    {/* ═══ Search Results ═══ */}
                    {searchResults !== null && (
                        <div className="mb-8">
                            <LatestProducts
                                title={`Search Results(${searchResults.length} found)`}
                                products={searchResults}
                            />
                            {searchResults.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    No products match your filters. Try adjusting your criteria.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bottom banner */}
                    {bannerUrl && <img className='mt-7 h-[200px] w-auto sm:w-full' src={bannerUrl} alt="Advanced Search Banner" />}
                </div>
            </div>
        </div>
    );
};

export default AdvancedSearch;
