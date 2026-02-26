// Utility function to extract dominant color from an image
export const extractDominantColor = (imageSrc, callback) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Color frequency map
        const colorMap = {};

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Skip transparent pixels
            if (a < 125) continue;

            // Skip very dark or very light colors
            const brightness = (r + g + b) / 3;
            if (brightness < 30 || brightness > 240) continue;

            // Create color key (rounded to reduce variations)
            const colorKey = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;

            colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
        }

        // Find most frequent color
        let dominantColor = '200,155,123'; // Default fallback
        let maxCount = 0;

        for (const [color, count] of Object.entries(colorMap)) {
            if (count > maxCount) {
                maxCount = count;
                dominantColor = color;
            }
        }

        // Convert to hex
        const [r, g, b] = dominantColor.split(',').map(Number);
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

        callback(hex);
    };

    img.onerror = () => {
        // Fallback color if image fails to load
        callback('#C89B7B');
    };

    img.src = imageSrc;
};
