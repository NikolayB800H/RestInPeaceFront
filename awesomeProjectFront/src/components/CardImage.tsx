import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { imagePlaceholder } from '../api'
import axios from 'axios';

interface CardImageProps {
    url: string;
    className?: string;
}

const CardImage = ({ url, className, ...props }: CardImageProps) => {
    const [src, setSrc] = useState(imagePlaceholder);

    useEffect(() => {
        if (!url) {
            return;
        }
        axios.get(url, { responseType: 'blob' })
            .then(response => {
                if (response.status >= 500 || response.headers.server === 'GitHub.com') {
                    throw new Error(`Can't load image from ${url}`);
                }
                setSrc(URL.createObjectURL(response.data));
            })
            .catch(error => {
                console.error(error.message);
            });
        return () => {
            URL.revokeObjectURL(src);
        }
    }, [url]);

    const handleError = () => {
        console.error(`Error loading image: ${url}`);
    };

    return <Card.Img src={src} className={className + ', img-fluid, px-5'} onError={handleError} {...props} />;
};

export default CardImage;
