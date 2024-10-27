import React, {CSSProperties, useEffect, useState} from 'react';
import styles from '../../styles/General/PrettyImage.module.css';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}

export interface PrettyImageProps {
    onContextMenu?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
    imgProps: ImageProps;
    useLoader?: boolean;
    className?: string;
}

const PrettyImage: React.FC<PrettyImageProps> = (props) => {
    const [loadedSrc, setLoadedSrc] = useState('');
    const [error, setError] = useState(false);

    const useLoader = props.useLoader ?? false;

    useEffect(
        () => {
            const img = new Image();
            img.onload = () => {
                setError(false);
                setLoadedSrc(props.imgProps.src || '');
            };
            img.onerror = () => {
                setError(true);
            };
            img.src = props.imgProps.src || '';
        },
        [props.imgProps.src]
    );

    const handleContextMenu = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (props.onContextMenu) {
            props.onContextMenu(event);
        } else {
            event.preventDefault();
        }
    };

    const style: CSSProperties = {
        display: error ? 'none' : 'block',
        outline: 'none',
        userSelect: 'none'
    };

    if (useLoader && loadedSrc === '' && !error) {
        return (
            <div draggable={false} style={{
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
            }} {...props.imgProps}>
                <svg className={styles.spinnerSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d={'M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z'}
                        className={styles.spinner}/>
                </svg>
            </div>
        );
    }

    if (error || loadedSrc === '') {
        return <div draggable={false} style={{
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
        }} {...props.imgProps}/>;
    }

    return (
        <img
            draggable={false}
            style={style}
            className={props.className ?? ''}
            {...props.imgProps}
            src={loadedSrc}
            onContextMenu={handleContextMenu}
        />
    );
};

export default PrettyImage;