import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GalleryModal from './GalleryModal';
import displayIcon from '../assets/Icons/displayIcon.png';
import cameraIcon from '../assets/Icons/cameraIcon.png';
import batteryIcon from '../assets/Icons/batteryIcon.png';
import ramIcon from '../assets/Icons/ramIcon.png';
import osIcon from '../assets/Icons/releaseDateIcon.png';
import usFlag from '../assets/usFlag.png';
import europeFlag from '../assets/europeFlag.png';
import indiaFlag from '../assets/indiaFlag.png';
import pakistanFlag from '../assets/pakistanFlag.png';
import storageIcon from '../assets/Icons/storageIcon.png';
import phoneSizeIcon from '../assets/Icons/phoneSizeIcon.png';
import specsIcon from '../assets/Icons/specsIcon.png';
import compareIcon from '../assets/compareIcon.png';
import commentsIcon from '../assets/commentsIcon.png';
import picturesIcon from '../assets/picturesIcon.png';
import shareIcon from '../assets/shareIcon.png';
import viewsIcon from '../assets/viewsIcon.png';
import likesIcon from '../assets/likeIcon.png';
import { useProductLike } from '../hooks/useProductLike';
import { extractDominantColor } from '../utils/colorExtractor';

const FALLBACK_BACKGROUND_COLOR = '#C89B7B';

const parseColorChannels = (color) => {
    if (!color || typeof color !== 'string') return null;

    const rgbMatch = color.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch) {
        const [r, g, b] = rgbMatch[1].split(',').slice(0, 3).map((value) => Number.parseFloat(value.trim()));
        if ([r, g, b].every((channel) => Number.isFinite(channel))) {
            return { r, g, b };
        }
    }

    const normalizedHex = color.replace('#', '').trim();
    if (normalizedHex.length === 3) {
        const [r, g, b] = normalizedHex.split('').map((value) => Number.parseInt(value.repeat(2), 16));
        if ([r, g, b].every((channel) => Number.isFinite(channel))) {
            return { r, g, b };
        }
    }

    if (normalizedHex.length === 6) {
        const r = Number.parseInt(normalizedHex.slice(0, 2), 16);
        const g = Number.parseInt(normalizedHex.slice(2, 4), 16);
        const b = Number.parseInt(normalizedHex.slice(4, 6), 16);
        if ([r, g, b].every((channel) => Number.isFinite(channel))) {
            return { r, g, b };
        }
    }

    return null;
};

const isNeutralColor = (color) => {
    const channels = parseColorChannels(color);
    if (!channels) return true;

    const { r, g, b } = channels;
    const channelSpread = Math.max(r, g, b) - Math.min(r, g, b);
    return channelSpread < 18;
};

const MobileSpecsDetail = ({ productData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [derivedBackgroundColor, setDerivedBackgroundColor] = useState(null);
    const {
        isLiked,
        likesCount,
        likesLoading,
        likesReady,
        toggleLike,
        authRequiredCode,
    } = useProductLike({
        productId: productData?.id,
        initialLikesCount: productData?.likes,
    });

    debugger
    const apiBackgroundColor = productData?.background_color;
    const shouldUseExtractedColor = isNeutralColor(apiBackgroundColor);
    const backgroundColor = shouldUseExtractedColor
        ? (derivedBackgroundColor || FALLBACK_BACKGROUND_COLOR)
        : apiBackgroundColor;
    const specs = productData?.specifications || {};
    const prices = productData?.price || {};

    useEffect(() => {
        if (!shouldUseExtractedColor || !productData?.image) {
            setDerivedBackgroundColor(null);
            return;
        }

        let isCancelled = false;

        extractDominantColor(productData.image, (color) => {
            if (!isCancelled) {
                setDerivedBackgroundColor(color || FALLBACK_BACKGROUND_COLOR);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [productData?.image, shouldUseExtractedColor]);

    useEffect(() => {
        if (!import.meta.env.DEV) return;

        console.log('[MobileSpecsDetail] hero color', {
            productName: productData?.name,
            background_color: apiBackgroundColor,
            appliedBackgroundColor: backgroundColor,
            colorSource: shouldUseExtractedColor ? 'image-derived' : 'api-background_color',
        });
    }, [apiBackgroundColor, backgroundColor, productData?.name, shouldUseExtractedColor]);

    const device = useMemo(() => ({
        name: productData?.name || 'Product Name',
        image: productData?.image || 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-note20-5g.jpg',
        views: productData?.views || '0',
        likes: likesCount,
        releaseDate: specs?.released || productData?.released || productData?.release_date || 'Coming Soon',
        specs: {
            display: specs?.display_size ? specs.display_size.replace(/\s*Inches?/i, '') : '6.9',
            displayResolution: specs?.display_resolution || '1440 x 3088 pixels',
            camera: specs?.camera || '108MP',
            cameraVideo: specs?.video || '4320p',
            ram: specs?.ram || '6-12GB RAM',
            chipset: specs?.chipset || 'Exynos 990',
            battery: specs?.battery || '4500mAh',
            batteryType: specs?.battery_type || 'Li-Po',
            os: specs?.os || 'Android 10',
            storage: specs?.storage || '128GB/256GB/512GB',
            dimensions: specs?.body || specs?.dimensions || '208g, 8.1mm thickness',
        },
        prices: [
            { country: 'US', flag: usFlag, amount: prices?.usd ? `$${prices.usd}` : null },
            { country: 'EU', flag: europeFlag, amount: prices?.eu ? `EUR ${prices.eu}` : null },
            { country: 'IN', flag: indiaFlag, amount: prices?.inr ? `INR ${prices.inr}` : null },
            { country: 'PK', flag: pakistanFlag, amount: prices?.pkr ? `PKR ${prices.pkr}` : null },
        ].filter((price) => Boolean(price.amount)),
    }), [likesCount, prices?.eu, prices?.inr, prices?.pkr, prices?.usd, productData?.image, productData?.name, productData?.release_date, productData?.released, productData?.views, specs?.battery, specs?.battery_type, specs?.body, specs?.camera, specs?.chipset, specs?.dimensions, specs?.display_resolution, specs?.display_size, specs?.os, specs?.ram, specs?.released, specs?.storage, specs?.video]);

    const statCards = [
        { icon: displayIcon, title: device.specs.display, subtitle: device.specs.displayResolution },
        { icon: cameraIcon, title: device.specs.camera, subtitle: device.specs.cameraVideo },
        { icon: ramIcon, title: device.specs.ram, subtitle: device.specs.chipset },
        { icon: batteryIcon, title: device.specs.battery, subtitle: device.specs.batteryType },
    ];

    const detailRows = [
        { icon: osIcon, text: `Released ${device.releaseDate}` },
        { icon: phoneSizeIcon, text: device.specs.dimensions },
        { icon: specsIcon, text: device.specs.os },
        { icon: storageIcon, text: device.specs.storage },
    ];

    const handleToggleLike = async () => {
        try {
            await toggleLike();
        } catch (error) {
            if (error?.code === authRequiredCode) {
                navigate('/login', {
                    state: {
                        from: location,
                    },
                });
            }
        }
    };

    return (
        <div className="w-full">
            <div className="relative mb-2 w-full overflow-hidden">
                <div className="flex h-10 items-center justify-between sm:h-14">
                    <div className="absolute -bottom-1 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]" />
                    <div className="relative flex w-full items-end">
                        <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14">
                            <h1 className="pl-2 text-[12px] leading-none sm:pl-4 sm:text-[26px]">{device.name}</h1>
                        </div>
                    </div>

                    <div className="flex h-full shrink-0 items-start gap-2 pt-1 text-[#0580A5] sm:gap-6">
                        <div className="flex items-center gap-1">
                            <img src={viewsIcon} alt="" className="h-4 w-4 sm:h-5 sm:w-5" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] sm:text-base">{device.views}</span>
                                <span className="text-[8px] sm:text-[10px]">Views</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleLike}
                            disabled={likesLoading || !likesReady}
                            className={`flex items-center gap-1 leading-none ${isLiked ? 'text-[#046a8a]' : 'text-[#0580A5]'} disabled:opacity-70`}
                        >
                            <img src={likesIcon} alt="" className="h-4 w-4 sm:h-5 sm:w-5" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] sm:text-base">{device.likes}</span>
                                <span className="text-[8px] sm:text-[10px]">Likes</span>
                            </div>
                        </button>
                        <button type="button" className="flex items-center pt-0.5">
                            <img src={shareIcon} alt="" className="h-4 w-auto sm:h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="overflow-hidden px-1 py-1.5 sm:px-4 sm:py-5"
                style={{
                    backgroundColor,
                    backgroundImage: `
                        radial-gradient(circle at 24% 36%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.82) 18%, rgba(255,255,255,0) 42%),
                        linear-gradient(108deg, #ffffff 0%, #fbf6f1 18%, rgba(255,255,255,0.4) 34%, ${backgroundColor} 82%)
                    `,
                }}
            >
                <div className="grid grid-cols-[98px_minmax(0,1fr)] items-center gap-1 sm:grid-cols-[165px_minmax(0,1fr)] sm:gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <div className="flex items-center justify-center lg:justify-start">
                        <img
                            src={device.image}
                            alt={device.name}
                            className="max-h-[142px] w-auto object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.2)] sm:max-h-[250px] lg:max-h-[320px]"
                        />
                    </div>

                    <div className="min-w-0 self-center">
                        <div className="grid grid-cols-2 gap-0.5 sm:gap-2">
                            {statCards.map((card) => (
                                <div key={card.title} className="bg-[#0580A5] px-1 py-1 text-white sm:px-2 sm:py-2">
                                    <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                        <img src={card.icon} alt="" className="h-3.5 w-auto sm:h-8" />
                                        <div className="text-center">
                                            <div className="text-[8px] font-semibold leading-none sm:text-[24px]">{card.title}</div>
                                        </div>
                                    </div>
                                    <div className="mt-0.5 text-center text-[6px] leading-tight opacity-90 sm:mt-1 sm:text-[11px]">
                                        {card.subtitle}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-1 grid grid-cols-2 gap-0.5 sm:mt-2 sm:gap-2">
                            {detailRows.map((row) => (
                                <div
                                    key={row.text}
                                    className="flex items-stretch overflow-hidden text-white"
                                    style={{ background: 'linear-gradient(to right, #0580A5, rgba(5, 128, 165, 0.2))' }}
                                >
                                    <div className="flex w-6 shrink-0 items-center justify-center bg-[#03708F] sm:w-12">
                                        <img src={row.icon} alt="" className="h-3 w-auto sm:h-5" />
                                    </div>
                                    <div className="flex min-h-[23px] items-center px-1 text-[6px] leading-tight sm:min-h-[42px] sm:px-3 sm:text-[12px]">
                                        {row.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`mt-1 grid gap-0.5 ${device.prices.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'} sm:mt-2 sm:gap-1.5`}>
                            {device.prices.map((price) => (
                                <div key={price.country} className="flex items-center gap-1 bg-[#0580A5] px-1 py-1 text-white sm:gap-2 sm:px-2 sm:py-2">
                                    <img src={price.flag} alt={price.country} className="h-2.5 w-4 object-cover sm:h-5 sm:w-8" />
                                    <span className="text-[6px] leading-tight sm:text-[11px]">{price.amount}</span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="mt-1 grid grid-cols-3 overflow-hidden text-white sm:mt-2"
                            style={{ background: 'linear-gradient(to right, #0580A5, rgba(5, 128, 165, 0.2))' }}
                        >
                            <button
                                type="button"
                                className="flex items-center justify-center gap-0.5 px-0.5 py-1 text-[7px] hover:opacity-90 sm:gap-1 sm:px-2 sm:py-2 sm:text-sm"
                                onClick={() => navigate('/comparison', { state: { deviceToCompare: device, rawDeviceData: productData } })}
                            >
                                <img src={compareIcon} alt="Compare" className="h-2.5 w-2.5 sm:h-5 sm:w-5" />
                                <span>Compare</span>
                            </button>
                            <div className="flex items-center justify-center gap-0.5 px-0.5 py-1 text-[7px] sm:gap-1 sm:px-2 sm:py-2 sm:text-sm">
                                <img src={commentsIcon} alt="Comments" className="h-2.5 w-2.5 sm:h-5 sm:w-5" />
                                <span>Comments</span>
                            </div>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-0.5 px-0.5 py-1 text-[7px] hover:opacity-90 sm:gap-1 sm:px-2 sm:py-2 sm:text-sm"
                                onClick={() => setIsGalleryOpen(true)}
                            >
                                <img src={picturesIcon} alt="Pictures" className="h-2.5 w-2.5 sm:h-5 sm:w-5" />
                                <span>Pictures</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <GalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={productData?.gallery}
                productName={productData?.name}
            />
        </div>
    );
};

export default MobileSpecsDetail;
