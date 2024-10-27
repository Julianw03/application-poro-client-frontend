import {EOGHonorPlayer} from '../../../../../types/Store';
import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowPreEndOfGame/HonorCard.module.css';
import * as Globals from '../../../../../Globals';
import axios from 'axios';
import {useState} from 'react';


export interface HonorCardProps {
    player: EOGHonorPlayer;
    gameId: number;
}

export default function HonorCard(
    {
        player: {
            puuid,
            summonerId,
            championName,
            gameName,
            skinSplashPath
        },
        gameId
    }: HonorCardProps
) {
    const basicUrl = Globals.STATIC_PREFIX + '/assets/png/honor/';

    const SHOTCALLER = 'shotcaller.png';
    const SHOTCALLER_ACTIVE = 'shotcaller_selected.png';

    const COOL = 'cool.png';
    const COOL_ACTIVE = 'cool_selected.png';

    const HEART = 'heart.png';
    const HEART_ACTIVE = 'heart_selected.png';

    const [coolImage, setCoolImage] = useState(Globals.STATIC_PREFIX + '/assets/png/honor/cool.png');
    const [shotcallerImage, setShotcallerImage] = useState(Globals.STATIC_PREFIX + '/assets/png/honor/shotcaller.png');
    const [heartImage, setHeartImage] = useState(Globals.STATIC_PREFIX + '/assets/png/honor/heart.png');

    const honorPlayer = (honorType: string) => {
        if (honorType === undefined) {
            return;
        }

        const honor = {
            gameId: gameId,
            honorType: honorType,
            puuid: puuid,
            summonerId: summonerId
        };


        axios.post(
            Globals.PROXY_PREFIX + '/lol-honor-v2/v1/honor-player',
            honor
        )
            .then((response) => {
                setTimeout(
                    () => {
                        axios.post(Globals.PROXY_PREFIX + '/lol-pre-end-of-game/v1/complete/missions-celebration')
                            .then(() => {

                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        console.log(response);
                    },
                    500
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className={styles.honorCard}>
            <div className={styles.bgImageContainer}>
                <img
                    loading={'eager'}
                    src={Globals.PROXY_PREFIX + skinSplashPath}
                    alt={''}
                    className={styles.bgImage}
                />
                <div className={styles.honorCategories}>
                    <div
                        className={styles.honorCategory}
                        onClick={() => {
                            honorPlayer('COOL');
                        }}
                        onMouseEnter={() => {
                            setCoolImage(basicUrl + COOL_ACTIVE);
                        }}
                        onMouseLeave={() => {
                            setCoolImage(basicUrl + COOL);
                        }}
                    >
                        <img
                            src={coolImage}
                            draggable="false"
                            alt={'Cool'}
                            className={styles.honorImage}
                        />
                    </div>
                    <div className={styles.honorCategory}
                         onClick={() => {
                             honorPlayer('SHOTCALLING');
                         }}
                         onMouseEnter={() => {
                             setShotcallerImage(basicUrl + SHOTCALLER_ACTIVE);
                         }}
                         onMouseLeave={() => {
                             setShotcallerImage(basicUrl + SHOTCALLER);
                         }}
                    >
                        <img
                            src={shotcallerImage}
                            draggable="false"
                            alt={'Shotcaller'}
                            className={styles.honorImage}
                        />
                    </div>
                    <div className={styles.honorCategory}
                         onClick={() => {
                             honorPlayer('HEART');
                         }}
                         onMouseEnter={() => {
                             setHeartImage(basicUrl + HEART_ACTIVE);
                         }}
                         onMouseLeave={() => {
                             setHeartImage(basicUrl + HEART);
                         }}
                    >
                        <img
                            src={heartImage}
                            draggable="false"
                            alt={'Heart'}
                            className={styles.honorImage}
                        />
                    </div>
                </div>
                <div className={styles.playerInfoContainer}>
                    <div>
                        <h1>{gameName}</h1>
                        <h2>{championName}</h2>
                    </div>
                </div>
            </div>
        </div>

    );
}