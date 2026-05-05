import React, { useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const BannerAd = ({ banner, className = "" }) => {
    if (!banner) return null;

    const { ads_type, image, mobile_image, tablet_image, google_adsense_slot_id, url, title } = banner;

    useEffect(() => {
        if (ads_type === 'google_adsense') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }
    }, [ads_type, google_adsense_slot_id]);

    const getImgUrl = (img) => {
        if (!img) return "";
        if (img.startsWith("http")) return img;
        const apiBase = API_BASE_URL;
        const cleanPath = img.replace(/^\/?storage\//, '');
        return `${apiBase}/storage/${cleanPath}`;
    };

    const renderContent = () => {
        if (ads_type === 'google_adsense' && google_adsense_slot_id) {
            return (
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-1234567890123456"
                    data-ad-slot={google_adsense_slot_id}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                ></ins>
            );
        }

        if (image) {
            const desktopImg = getImgUrl(image);
            const mobileImg = getImgUrl(mobile_image) || desktopImg;
            const tabletImg = getImgUrl(tablet_image) || desktopImg;

            return (
                <picture className="block w-full h-full">
                    {/* Mobile Banner: Max width 640px */}
                    <source
                        media="(max-width: 640px)"
                        srcSet={mobileImg}
                    />
                    {/* Tablet Banner: 641px to 1024px */}
                    <source
                        media="(min-width: 641px) and (max-width: 1024px)"
                        srcSet={tabletImg}
                    />
                    {/* Desktop / Fallback Image */}
                    <img
                        src={desktopImg}
                        alt={title || "Banner Ad"}
                        className={`w-full h-auto object-cover ${className}`}
                    />
                </picture>
            );
        }

        return null;
    };

    const formatUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    const content = renderContent();
    if (!content) return null;

    if (url) {
        return (
            <a
                href={formatUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full cursor-pointer transition-opacity hover:opacity-90 ${className}`}
            >
                {content}
            </a>
        );
    }

    return <div className={`w-full ${className}`}>{content}</div>;
};

export default BannerAd;
