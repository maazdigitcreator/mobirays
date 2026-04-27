import { useEffect } from 'react';

const useMetadata = (title, description) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (description) {
            let descriptionTag = document.querySelector('meta[name="description"]');
            if (!descriptionTag) {
                descriptionTag = document.createElement('meta');
                descriptionTag.setAttribute('name', 'description');
                document.head.appendChild(descriptionTag);
            }
            descriptionTag.setAttribute('content', description);
        }
    }, [title, description]);
};

export default useMetadata;
