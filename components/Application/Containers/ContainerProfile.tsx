import styles from '../../../styles/Application/Containers/ContainerProfile.module.css';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {useEffect} from 'react';
import * as Globals from '../../../Globals';
import axios from 'axios';
import PrettyImage from '../../General/PrettyImage';
import PrettyVideo from '../../General/PrettyVideo';

export default function ContainerProfile() {

    const presence = useSelector((state: AppState) => state.selfPresence);
    //TODO: Fetch background image
    //TODO: Fetch banner image
    //TODO; Get Challenge Level

    if (!presence) {
        return (<></>);
    }

    //On-mount
    useEffect(
        () => {
            if (presence.puuid) {
                axios.get(Globals.PROXY_PREFIX + '/lol-hovercard/v1/friend-info/' + presence.puuid)
                    .then((response) => {
                        console.log('Refreshed presence data.');
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                axios.get(Globals.PROXY_PREFIX + '/lol-challenges/v1/summary-player-data/player/' + presence.puuid)
                    .then((response) => {
                        console.log('Refreshed challenge data.');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

        },
        []
    );

    useEffect(
        () => {
            if (!presence) {
                return;
            }
            const previewSpaceElement = document.querySelector(`.${styles.previewSpace}`) as HTMLDivElement;
            const crystalLevel = presence?.lol.challengeCrystalLevel?.toLowerCase();
            if (previewSpaceElement && crystalLevel) {
                console.log(crystalLevel);
                previewSpaceElement.style.setProperty(
                    '--crystal-level-url',
                    `url("http://localhost:35199/static/assets/png/challenges/crystals/${crystalLevel}.png")`
                );
            }
        },
        [presence?.lol.challengeCrystalLevel]
    );

    return (
        <div className={styles.previewSpace}>
            <div className={styles.backgroundImageContainer}>
                <img className={styles.coverImage}
                     src="http://127.0.0.1:35199/proxy/lol-game-data/assets/ASSETS/Characters/Ahri/Skins/Skin76/Images/ahri_splash_centered_76.jpg"
                     alt=""/>
                <div className={styles.backgroundImageFilter}>
                </div>
            </div>
            <div className={styles.bannerArea}>
                <div className={styles.bannerImageContainer}>
                    <img className={styles.bannerImage}
                         src="http://127.0.0.1:35199/proxy/lol-game-data/assets/ASSETS/Regalia/BannerSkins/UnkillableDemonKingBanner.ACCESSORIES_14_12.png"/>
                </div>
                <div className={styles.banner}>
                    <div className={styles.spacer}></div>
                    <div className={styles.levelProgress}>
                        <div className={styles.levelText}>
                            Level {presence.lol.level}
                        </div>
                    </div>
                    <div className={styles.profileSection}>
                        <div className={styles.profileContainer}>
                            <div className={styles.profileIcon}>
                                {/*<div className={styles.prestigeRegalia}></div>*/}
                                <div className={styles.rankedRegalia}>
                                    <PrettyVideo
                                        className={styles.rankedRegaliaVideo}
                                        videoProps={{
                                            autoPlay: true,
                                            loop: true,
                                            muted: true,
                                            src: Globals.STATIC_PREFIX + '/assets/webm/regalia/emblem-wings-magic-gold.webm'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.nameSection}>
                        <div className={styles.nameWrapper}>
                            {presence.gameName}
                        </div>
                    </div>
                    <div className={styles.tokenSection}>
                        <div className={styles.tokenWrapper}>
                            <div className={styles.tokenTitle}>
                                Poroyalty
                            </div>
                            <div className={styles.tokens}>
                                <div className={styles.singleToken}>
                                    <PrettyImage
                                        className={styles.tokenImage}
                                        imgProps={{
                                            src: Globals.PROXY_PREFIX + '/lol-game-data/assets/ASSETS/Challenges/Config/504004/Tokens/iron.png'
                                        }}
                                    />
                                </div>
                                <div className={styles.singleToken}>
                                    <PrettyImage
                                        className={styles.tokenImage}
                                        imgProps={{
                                            src: Globals.STATIC_PREFIX + '/assets/png/challenges/background.png'
                                        }}
                                    />
                                </div>
                                <div className={styles.singleToken}>
                                    <PrettyImage
                                        className={styles.tokenImage}
                                        imgProps={{
                                            src: Globals.PROXY_PREFIX + '/lol-game-data/assets/ASSETS/Challenges/Config/504004/Tokens/iron.png'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}