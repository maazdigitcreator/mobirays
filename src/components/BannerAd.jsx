import React, { useEffect } from 'react';

const BannerAd = ({ banner, className = "" }) => {
    if (!banner) return null;

    const { ads_type, image, google_adsense_slot_id, url, title } = banner;

    useEffect(() => {
        if (ads_type === 'google_adsense') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }
    }, [ads_type, google_adsense_slot_id]);

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
            return (
                <img
                    src={image}
                    alt={title || "Banner Ad"}
                    className={`w-full h-auto object-cover ${className}`}
                />
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
