import {useSelector} from 'react-redux';
import {AppState} from '../../../../../store';
import * as Globals from '../../../../../Globals';
import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowChampSelect/ReworkedSkinSelector.module.css';
import {useEffect, useState} from 'react';
import {Skin} from '../../../../../types/Store';
import axios from 'axios';

const gapPercentage = 3.5;
const slideWidthPercentage = 30;

export interface ReworkedSkinSelectorProps {
    championId: number;
    setSkinId?: (skinId: number) => void;
    initialSkinId?: number;
}

export default function ReworkedSkinSelector(data: ReworkedSkinSelectorProps) {
    const skins = useSelector((state: AppState) => state.skins);
    const skinsByChampion = useSelector((state: AppState) => state.skinsByChampion);

    const ownedSkins = useSelector((state: AppState) => state.ownedSkins);

    const [activeIndex, setActiveIndex] = useState(0);

    const elementOwned = (skin: Skin) => {
        return skin.isBase || (ownedSkins[skin.id] !== undefined);
    };

    const displaySkins = skinsByChampion[data.championId];

    const changeSkin = (index: number) => {
        if (displaySkins === undefined) {
            return;
        }
        const patchObject = {
            selectedSkinId: Object.values(displaySkins)[index]
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

    useEffect(
        () => {
            const initialSkinId = data.initialSkinId;
            if (initialSkinId && displaySkins) {
                const index = displaySkins.indexOf(initialSkinId);
                if (index === -1) {
                    setActiveIndex(0);
                } else {
                    setActiveIndex(index);
                }
            }
        },
        [data.championId]
    );

    useEffect(
        () => {
            changeSkin(activeIndex);
        },
        [activeIndex]
    );

    if (displaySkins === undefined) {
        return <></>;
    }
    const dataLength = displaySkins.length;
    const calculateOffset = (index: number) => {
        const offset = 50 - slideWidthPercentage / 2 - index * (slideWidthPercentage + gapPercentage);

        console.log(offset);

        return offset;
    };


    const handleLeftClick = () => {
        setActiveIndex(
            activeIndex === 0 ? dataLength - 1 : activeIndex - 1
        );
    };

    const handleRightClick = () => {
        setActiveIndex(
            activeIndex === (dataLength - 1) ? 0 : activeIndex + 1
        );
    };

    return (
        <div className={styles.wrapperContainer}>
            <div className={styles.abstractButtonContainer}>
                {displaySkins.map((skinId, index) => {

                    const skin = skins[skinId];

                    return (
                        <button key={skinId}
                                className={Globals.applyMultipleStyles(
                                    styles.singleDotWrapper,
                                    index === activeIndex ? styles.activeDot : ''
                                )}
                                onClick={() => {
                                    setActiveIndex(index);
                                }}
                                title={skin.name}
                                aria-label={skin.name}
                                aria-pressed={index === activeIndex}
                        >
                        </button>
                    );
                })}
            </div>
            <div className={styles.middleSection}>
                <div className={styles.buttonLeft} onClick={handleLeftClick}>
                    <svg className={styles.lrIcon} viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
                              fill="#F0F0F0"/>
                    </svg>
                </div>
                <div className={styles.wrapper}>
                    <ul className={styles.slideContainer} style={{
                        transform: `translateX(${calculateOffset(activeIndex)}%)`,
                        gap: `${gapPercentage}%`
                    }}>
                        {displaySkins.map((id, index) => {

                            const skin = skins[id];

                            return (
                                <li key={id}
                                    className={Globals.applyMultipleStyles(
                                        styles.slides,
                                        index === activeIndex ? styles.active : ''
                                    )}
                                    style={{
                                        width: `${slideWidthPercentage}%`
                                    }}
                                    onClick={() => {
                                        setActiveIndex(index);
                                    }}>
                                    <div className={styles.bgImage}>
                                        <img
                                            className={Globals.applyMultipleStyles(
                                                styles.image,
                                                elementOwned(skin) ? '' : styles.unowned
                                            )}
                                            alt={skin.name}
                                            src={Globals.PROXY_STATIC_PREFIX + skin.splashPath}/>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className={styles.buttonRight} onClick={handleRightClick}>
                    <svg className={styles.lrIcon} viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#F0F0F0"/>
                    </svg>
                </div>
            </div>
            <div className={styles.nameContainer}>
                {
                    displaySkins[activeIndex] ? skins[displaySkins[activeIndex]].name : ''
                }
            </div>
        </div>
    );
}