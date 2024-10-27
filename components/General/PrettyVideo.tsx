import React, {useEffect, useState} from 'react';
import styles from '../../styles/General/PrettyVideo.module.css';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
}

export enum PLACEHOLDER_TYPE {
    NONE,
    SPINNER,
    INVISIBLE
}


export interface PrettyVideoProps {
    onContextMenu?: (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void;
    placeholderType?: PLACEHOLDER_TYPE;
    videoProps: VideoProps;
    className?: string;
}

const PrettyVideo: React.FC<PrettyVideoProps> = (props) => {
    const [loadedSrc, setLoadedSrc] = useState('');

    const placeholderType = props.placeholderType || PLACEHOLDER_TYPE.NONE;

    useEffect(
        () => {
            const video = document.createElement('video');
            video.load();
            video.onloadeddata = () => {
                setLoadedSrc(props.videoProps.src || '');
            };
            video.src = props.videoProps.src || '';
        },
        [props.videoProps.src]
    );

    const handleContextMenu = (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
        if (props.onContextMenu) {
            props.onContextMenu(event);
        } else {
            event.preventDefault();
        }
    };

    const divProps = props.videoProps as unknown as React.HTMLAttributes<HTMLDivElement>;

    if (loadedSrc === '') {
        switch (placeholderType) {
            case PLACEHOLDER_TYPE.SPINNER:
                return (
                    <div draggable={false} style={{
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%'
                    }} {...divProps}>
                        <svg className={styles.spinnerSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d={'M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z'}
                                className={styles.spinner}/>
                        </svg>
                    </div>
                );
            case PLACEHOLDER_TYPE.INVISIBLE:
                return (
                    <div draggable={false} style={{
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%'
                    }} {...divProps}/>
                );
            default:
            case PLACEHOLDER_TYPE.NONE:
                return (
                    <video draggable={false} style={{userSelect: 'none'}}
                           className={props.className ?? ''} {...props.videoProps}
                           src={loadedSrc} onContextMenu={handleContextMenu}/>
                );
        }
    }

    return (
        <video draggable={false} style={{userSelect: 'none'}}
               className={props.className ?? ''} {...props.videoProps}
               src={loadedSrc} onContextMenu={handleContextMenu}/>
    );
};

export default PrettyVideo;