import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { imagePlaceholder } from '../api'
import axios from 'axios';
import useIsMounted from '../hooks/mounted'

interface CardImageProps {
    url: string;
    className?: string;
}

const CardImage = ({ url, className, ...props }: CardImageProps) => {
    const [src, setSrc] = useState(imagePlaceholder);
    const mounted = useIsMounted();

    useEffect(() => {
        if (!url) {
            return;
        }
        setSrc(url);
        axios.get(url, { responseType: 'blob' })
            .then(response => {
                if (response.status >= 500 || response.headers.server === 'GitHub.com') {
                    throw new Error(`Can't load image from ${url}`);
                }
                //let tmp = URL.createObjectURL(response.data);
                setSrc(URL.createObjectURL(response.data));
                //console.log(tmp);
            })
            .catch(error => {
                console.error(error.message);
            });
    }, [url]);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(src);
            //console.log('revoke ', src)
        }
    }, [mounted]);

    const handleError = () => {
        console.error(`Error loading image: ${url}`);
    };

    return <Card.Img src={src} className={className + ', img-fluid, px-5'} onError={handleError} {...props} />;
};

export default CardImage;
