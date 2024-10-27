import Carousel from 'react-bootstrap/Carousel';
import {useEffect, useState} from 'react';
import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowChampSelect/SkinSelector.module.css';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../../store';
import {Skin} from '../../../../../types/Store';
import * as Globals from '../../../../../Globals';

interface SkinSelectorProps {
    championId: number;
}

export default function SkinSelector({championId}: SkinSelectorProps) {

    const skins = useSelector((state: AppState) => state.skins);
    const skinsByChampion = useSelector((state: AppState) => state.skinsByChampion);

    const ownedSkins = useSelector((state: AppState) => state.ownedSkins);

    const [index, setIndex] = useState(0);
    const [skinsAsArray, setSkinsAsArray] = useState<Skin[]>([]);

    useEffect(
        () => {
            const skinIds = skinsByChampion[championId];

            const intermediateArray: Skin[] = [];

            if (!skinIds) {
                return;
            }

            for (const skinId of skinIds) {
                intermediateArray.push(skins[skinId]);
            }
            setIndex(0);
            setSkinsAsArray(intermediateArray);
        },
        [championId]
    );

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    const handleSlideEnd = () => {
        const patchObject = {
            selectedSkinId: skinsAsArray[index].id
        };
        axios.patch(
            'http://127.0.0.1:35199/proxy/lol-champ-select/v1/session/my-selection',
            JSON.stringify(patchObject)
        )
            .then(() => {
            })
            .catch(() => {
            });
    };

    const getCenteredImageLinks = (skinId: number) => {
        const skin = skins[skinId];
        return Globals.PROXY_STATIC_PREFIX + skin.splashPath;
    };

    const getUncenteredImageLinks = (skinId: number) => {
        const skin = skins[skinId];
        return Globals.PROXY_STATIC_PREFIX + skin.uncenteredSplashPath;
    };


    const elementOwned = (element: Skin) => {
        if (!element) {
            return false;
        }
        if (element.id % 1000 === 0) {
            return true;
        }

        return ownedSkins[element.id] !== undefined;
    };

    const renderFilter = (owned: boolean) => {
        if (owned) {
            return <div className={`${styles.filter} ${styles.owned}`}></div>;
        }

        return (
            <>
                <div className={`${styles.filter} ${styles.unowned}`}></div>
                <svg xmlns="http://www.w3.org/2000/svg" height="20%" fill="currentColor" className="bi bi-lock"
                     viewBox="0 0 16 16"
                     style={{
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         transform: 'translate(-50%, -50%)'
                     }}
                >
                    <path
                        d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                </svg>
            </>
        );
    };

    const renderCarouselItem = (element: Skin) => {
        if (!element) {
            return;
        }

        const item = element;

        return (
            <Carousel.Item key={item.id}>
                <div className={styles.imageWrapper}>
                    {
                        renderFilter(elementOwned(item))
                    }
                    <Carousel.Caption>
                        <h3>{item.name}</h3>
                    </Carousel.Caption>
                    <img className={styles.image} src={getCenteredImageLinks(item.id)}></img>
                </div>
            </Carousel.Item>
        );
    };


    return (
        <div className={styles.containerWrapper}>
            <div className={styles.container}>

                <Carousel activeIndex={index} slide={false} onSelect={handleSelect} onSlid={handleSlideEnd}
                          interval={null}>
                    {skinsAsArray.map((element) => renderCarouselItem(element))}
                </Carousel>
            </div>
        </div>
    );
}