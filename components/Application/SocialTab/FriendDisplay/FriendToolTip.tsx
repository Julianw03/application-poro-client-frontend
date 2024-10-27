import {useSelector} from 'react-redux';
import * as Globals from '../../../../Globals';
import {AppState} from '../../../../store';
import axios from 'axios';
import styles from '../../../../styles/Application/SocialTab/FriendDisplay/FriendToolTip.module.css';
import {Friend, Queue, SocialAvailability} from '../../../../types/Store';
import {useEffect, useState} from 'react';
import PrettyImage from '../../../General/PrettyImage';
import PrettyVideo, {PLACEHOLDER_TYPE} from '../../../General/PrettyVideo';
import PrettyTimer from './PrettyTimer';


export interface FriendToolTipArgs {
    friend: Friend;
}

interface BackgroundInfo {
    accountId: number,
    backdropImage: string,
    backdropMaskColor: string,
    backdropType: string,
    backdropVideo: string,
    championId: number,
    profileIconId: number,
    puuid: string,
    summonerId: number,
}

const fetchBackground = (summonerId, setValue) => {
    axios.get(Globals.PROXY_PREFIX + '/lol-collections/v1/inventories/' + summonerId + '/backdrop')
        .then((response) => {
            console.log(response.data);
            setValue(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
};

const renderActivityPretty = (queueTypeToId, queues: Record<number, Queue>, gameQueueType: string) => {
    if (queueTypeToId === undefined || queues === undefined) {
        console.log('Queue type to id or queues is undefined');
        return gameQueueType;
    }

    const queueId = queueTypeToId[gameQueueType];
    if (queueId === undefined) {
        console.log('Key not found in queue type to id: ');
        return gameQueueType;
    }

    const queue = queues[queueId] as Queue | undefined;
    if (queue === undefined) {
        console.log('Queue not found in queues');
        return gameQueueType;
    }

    return queue.shortName;
};

const GAME_STATUS_INGAME = 'inGame';

export default function FriendToolTip(props: FriendToolTipArgs) {
    const friend = props.friend;

    const {puuid, id, gameName, gameTag, summonerId} = friend;

    const [backgroundInfo, setBackgroundInfo] = useState<null | BackgroundInfo>(null);
    const challengeSummary = useSelector((state: AppState) => state.challengeSummary);
    const chromaMap = useSelector((state: AppState) => state.chromaToParentSkin);
    const skins = useSelector((state: AppState) => state.skins);
    const champions = useSelector((state: AppState) => state.champions);
    const queueTypeToId = useSelector((state: AppState) => state.queueTypeToId);
    const queues = useSelector((state: AppState) => state.queues);

    useEffect(
        () => {
            fetchBackground(
                summonerId,
                setBackgroundInfo
            );
        },
        [friend.summonerId]
    );

    const optChallengeSummary = challengeSummary[puuid];
    if (optChallengeSummary === undefined) {
        console.log('No challenge summary for ' + puuid);
        axios.get(Globals.REST_V1_PREFIX + '/managers/map/com.iambadatplaying.data.map.ChallengeSummaryDataManager/' + puuid)
            .then((response) => {
            })
            .catch((error) => {
            });
    } else {
        console.log(
            'Challenge summary for ' + puuid + ' is ',
            optChallengeSummary
        );
    }

    const renderBackground = () => {
        if (backgroundInfo === null) {
            return '';
        }
        if (backgroundInfo.backdropVideo && (friend.lol?.gameStatus !== GAME_STATUS_INGAME)) {
            return (
                <PrettyVideo className={Globals.applyMultipleStyles(
                    styles.fill,
                    styles.objectFitCover
                )} videoProps={{
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    disablePictureInPicture: true,
                    src: Globals.PROXY_STATIC_PREFIX + backgroundInfo.backdropVideo
                }} placeholderType={PLACEHOLDER_TYPE.INVISIBLE}/>
            );
        }

        return (
            <PrettyImage className={Globals.applyMultipleStyles(
                styles.fill,
                styles.objectFitCover
            )} imgProps={{src: getBackgroundUrl()}} useLoader={false}/>
        );
    };

    const getBackgroundUrl = () => {
        if (chromaMap === undefined || skins === undefined) {
            return '';
        }

        const fallbackUrl = backgroundInfo.backdropImage ? Globals.PROXY_PREFIX + backgroundInfo.backdropImage : '';

        if (friend.lol === undefined) {
            return fallbackUrl;
        }

        const currentSkinId = friend.lol.skinVariant;
        if ('' === currentSkinId) {
            return fallbackUrl;
        }

        const parentSkinId = chromaMap[currentSkinId];
        if (parentSkinId === undefined) {
            return fallbackUrl;
        }

        const skin = skins[parentSkinId];
        if (skin === undefined) {
            return fallbackUrl;
        }

        const fullSkinInfo = skins[skin.id];
        return Globals.PROXY_STATIC_PREFIX + fullSkinInfo.splashPath;
    };

    const queueId = (queues: Record<number, Queue>, queueId: string | undefined) => {
        if (queues === undefined || queueId === undefined) {
            return '';
        }

        const queue = queues[queueId];
        if (queue === undefined) {
            return '';
        }

        console.log(queue);

        return queue.shortName;
    };

    const renderTimer = (availiable: SocialAvailability, timestamp: string) => {
        if (availiable === SocialAvailability.DND) {
            return (<PrettyTimer startTimestamp={timestamp}/>);
        }
    };

    return (
        <div className={styles.fillContainer}>
            <div className={styles.backdropContentContainer}>
                {
                    renderBackground()
                }
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.topContent}/>
                <div className={styles.friendName}>
                    {friend.gameName}#{friend.gameTag}
                </div>
                <div className={styles.friendStatus}>
                    {friend.availability}<br/>
                </div>
                <div className={styles.activityDiv}>
                    <div className={styles.activityIcon}>
                        {friend.availability}
                    </div>
                    <div className={styles.activityDescription}>
                        {queueId(
                            queues,
                            friend.lol?.queueId
                        )}

                        &nbsp;

                        {champions[friend.lol?.championId]?.name}
                    </div>
                    <div className={styles.activityTimer}>
                        {
                            renderTimer(friend.availability , friend.lol?.timeStamp)
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}