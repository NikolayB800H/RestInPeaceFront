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
            return
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

    }, [url]);

    const handleError = () => {
        console.error(`Error loading image: ${url}`);
    };

    /*return (<>
    {(src.endsWith(".jpg") === true) && <Card.Img src={src} className={className + ', img-fluid, px-5'} onError={handleError} {...props} />}
    {(src.endsWith(".svg") === true) && <Card.Img src={src} className={className + ', img-fluid, px-5'} onError={handleError} {...props} />}
    </>);*/
    return <Card.Img src={src} className={className + ', img-fluid, px-5'} onError={handleError} {...props} />;
};

export default CardImage;