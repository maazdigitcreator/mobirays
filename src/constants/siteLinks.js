export const socialLinks = [
    {
        key: 'facebook',
        label: 'Facebook',
        href: import.meta.env.VITE_FACEBOOK_URL || '',
    },
    {
        key: 'twitter',
        label: 'Twitter',
        href: import.meta.env.VITE_TWITTER_URL || '',
    },
    {
        key: 'instagram',
        label: 'Instagram',
        href: import.meta.env.VITE_INSTAGRAM_URL || '',
    },
    {
        key: 'youtube',
        label: 'YouTube',
        href: import.meta.env.VITE_YOUTUBE_URL || '',
    },
    {
        key: 'rss',
        label: 'RSS',
        href: import.meta.env.VITE_RSS_URL || '',
    },
];

export const storeLinks = {
    googlePlay: import.meta.env.VITE_GOOGLE_PLAY_URL || '',
    appStore: import.meta.env.VITE_APP_STORE_URL || '',
};
