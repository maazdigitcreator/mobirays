// Utility function to create URL-friendly slugs from product names
export const createSlug = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

// Example: "iPhone 16 Series Concept 1" -> "iphone-16-series-concept-1"
