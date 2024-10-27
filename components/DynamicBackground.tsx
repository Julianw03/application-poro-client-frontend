import {useEffect, useState} from 'react';
import * as Globals from '../Globals';
import styles from '../styles/DynamicBackground.module.css';
import axios from 'axios';


export enum ClientBackgroundType {
    LOCAL_IMAGE = '' + Globals.BACKGROUND_TYPE_IMAGE,
    LOCAL_VIDEO = '' + Globals.BACKGROUND_TYPE_VIDEO,
    LCU_IMAGE = '' + Globals.BACKGROUND_TYPE_LCU_IMAGE,
    LCU_VIDEO = '' + Globals.BACKGROUND_TYPE_LCU_VIDEO,
    NONE = '' + Globals.BACKGROUND_TYPE_NONE
}

export interface BackgroundInfo {
    backgroundType: ClientBackgroundType,
    background: string,
    backgroundContentType: string,
}

export default function DynamicBackground() {

    const [backgroundInfo, setBackgroundInfo] = useState<BackgroundInfo>();

    useEffect(
        () => {
            axios.get(Globals.REST_PREFIX + '/config/background/info')
                .then((response) => {
                    console.log(response.data);
                    const backgroundInfo: BackgroundInfo = response.data as BackgroundInfo;
                    setBackgroundInfo(backgroundInfo);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        []
    );

    const renderVideo = () => {
        return (
            <video className={styles.content} autoPlay={true} muted={true} loop={true} disablePictureInPicture={true}>
                <source src={Globals.REST_PREFIX + '/config/background'}/>
            </video>
        );
    };

    const renderImage = () => {
        return (
            <img className={styles.content} src={Globals.REST_PREFIX + '/config/background'}></img>
        );
    };

    const renderContent = () => {
        switch (backgroundInfo?.backgroundType) {
            case ClientBackgroundType.LOCAL_IMAGE:
            case ClientBackgroundType.LCU_IMAGE:
                return renderImage();
            case ClientBackgroundType.LOCAL_VIDEO:
            case ClientBackgroundType.LCU_VIDEO:
                return renderVideo();
            default:
                console.log(
                    'Unknown background type: ',
                    backgroundInfo?.backgroundType
                );
                return (<></>);
        }
    };


    return (
        <div className={styles.container} draggable={false}>
            {
                renderContent()
            }
            <div className={styles.filter}></div>
        </div>
    );
}