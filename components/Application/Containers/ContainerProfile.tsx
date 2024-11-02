import styles from '../../../styles/Application/Containers/ContainerProfile.module.css';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {useEffect, useState} from 'react';
import * as Globals from '../../../Globals';
import axios from 'axios';
import PrettyImage from '../../General/PrettyImage';
import PrettyVideo, {PLACEHOLDER_TYPE} from '../../General/PrettyVideo';
import {ChallengeSummary, PUUID, SUMMONER_ID, UserRegalia} from '../../../types/Store';

const DEFAULT_EMPTY_TOKEN_URL = Globals.STATIC_PREFIX + '/assets/png/challenges/background.png';
const MAXIMUM_TOKENS = 3;

const RANKED_BANNER_ID = '2';

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

export default function ContainerProfile() {

    const presence = useSelector((state: AppState) => state.selfPresence);
    const regaliaData = useSelector((state: AppState) => state.regalia);
    const regaliaMap = useSelector((state: AppState) => state.userRegalia);
    const challengeEntryMap = useSelector((state: AppState) => state.challengeSummary);

    const [backgroundInfo, setBackgroundInfo] = useState<null | BackgroundInfo>(null);

    if (!presence) {
        return (<></>);
    }

    const fetchBackground = (summonerId: SUMMONER_ID) => {
        axios.get(Globals.PROXY_PREFIX + '/lol-collections/v1/inventories/' + summonerId + '/backdrop')
            .then((response) => {
                console.log('Background info: ', response.data);
                setBackgroundInfo(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const requestRegaliaUpdate = (summonerId: SUMMONER_ID) => {
        axios.get(Globals.PROXY_PREFIX + '/lol-regalia/v2/summoners/'+ summonerId +'/regalia/async')
            .then((response) => {
                console.log('Refreshed regalia data.');
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const requestChallengeUpdate = (puuid: PUUID) => {
        axios.get(Globals.PROXY_PREFIX + '/lol-challenges/v1/summary-player-data/player/' + puuid)
            .then((response) => {
                console.log('Refreshed challenge data.');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //On-mount
    useEffect(
        () => {
            if (presence.puuid && presence.summonerId) {
                requestChallengeUpdate(presence.puuid);
                requestRegaliaUpdate(presence.summonerId);
                fetchBackground(presence.summonerId);
            }
        },
        []
    );

    const getBannerUrl = (selectedBannerId: string | undefined) => {
        if (selectedBannerId === RANKED_BANNER_ID) {
            const currentRank = regaliaMap[presence.summonerId]?.lastSeasonHighestRank?.toUpperCase() ?? 'UNRANKED';
            const url = regaliaData?.[selectedBannerId]?.secondaryMap?.[currentRank ?? 'UNRANKED']?.assetPath;
            if (url === undefined) {
                return '';
            }
            return Globals.PROXY_PREFIX + url;
        }

        const selectedPath = regaliaData?.[selectedBannerId]?.default?.assetPath;
        if (!selectedPath) {
            return '';
        }
        return Globals.PROXY_PREFIX + selectedPath;
    };


    const renderBackground = (bgInfo: BackgroundInfo | null) => {
        if (bgInfo == null || bgInfo?.backdropVideo) {
            return (
                <PrettyVideo
                    videoProps={{
                        src: Globals.PROXY_PREFIX + bgInfo?.backdropVideo,
                        autoPlay: true,
                        muted: true,
                        loop: true
                    }}
                    className={styles.coverImage}
                    placeholderType={PLACEHOLDER_TYPE.SPINNER}
                />
            );
        }

        return (
            <PrettyImage
                imgProps={{
                    src: Globals.PROXY_PREFIX + bgInfo?.backdropImage
                }}
                className={styles.coverImage}
                useLoader={false}
            />
        );
    };

    const renderRankedRegalia = (regalia: UserRegalia) => {
        const highestRankedEntry = regalia?.highestRankedEntry?.tier?.toLowerCase() ?? 'unranked';

        const videoUrl = Globals.STATIC_PREFIX + `/assets/webm/regalia/emblem-wings-magic-${highestRankedEntry}.webm`;
        const plateUrl = Globals.STATIC_PREFIX + `/assets/png/regalia/plate/wings_${highestRankedEntry}_plate.png`;

        return (
            <div className={styles.rankedRegalia}>
                <PrettyVideo
                    className={styles.rankedRegaliaVideo}
                    videoProps={{
                        autoPlay: true,
                        loop: true,
                        muted: true,
                        src: videoUrl
                    }}
                    placeholderType={PLACEHOLDER_TYPE.INVISIBLE}
                />
                <PrettyImage
                    imgProps={{
                        src: plateUrl
                    }}
                    className={styles.rankedRegaliaPlateImage}
                    useLoader={false}
                />
            </div>
        );
    };


    const renderNormalRegalia = (regalia: UserRegalia | undefined) => {
        const selectedRegalia = regalia?.selectedPrestigeCrest;

        const url = Globals.STATIC_PREFIX + `/assets/png/regalia/prestige/regalia-prestige-${selectedRegalia}.png`;

        return (
            <PrettyImage
                imgProps={{
                    src: url
                }}
                className={styles.prestigeRegalia}
                useLoader={false}
            />
        );
    };

    const renderRegalia = (regalia: UserRegalia | undefined) => {
        if (regalia === undefined) {
            return <></>;
        }

        if (regalia?.crestType === 'ranked') {
            return renderRankedRegalia(regalia);
        }

        return renderNormalRegalia(regalia);
    };

    const renderProfileIcon = (presence: UserRegalia | undefined) => {

        const profileIconId = presence?.profileIconId;

        const url = Globals.PROXY_PREFIX + `/lol-game-data/assets/v1/profile-icons/${profileIconId}.jpg`;

        return (
            <PrettyImage
                imgProps={{
                    src: url
                }}
                useLoader={false}
                className={styles.testProfileIcon}
            />
        );
    };

    const renderCrystal = (challengeEntry: ChallengeSummary | undefined) => {

        const crystalLevel = challengeEntry?.overallChallengeLevel?.toLowerCase();

        const url = Globals.STATIC_PREFIX + `/assets/png/challenges/crystals/${crystalLevel}.png`;

        return (
            <PrettyImage
                imgProps={{
                    src: url
                }}
                className={styles.testCrystal}
                useLoader={false}
            />
        );

    };


    const renderTokens = (challengeEntry: ChallengeSummary | undefined) => {
        const retArr = [];

        for (let i = 0; i < MAXIMUM_TOKENS; i++) {

            const token = challengeEntry?.topChallenges?.[i];
            const currentLevel = token?.currentLevel.toUpperCase();
            const assetPath = token?.levelToIconPath?.[currentLevel];

            const url = assetPath ? Globals.PROXY_PREFIX + assetPath : DEFAULT_EMPTY_TOKEN_URL;

            retArr.push(
                <div className={styles.singleToken} key={i}>
                    <PrettyImage
                        className={styles.tokenImage}
                        imgProps={{
                            src: url
                        }}
                    />
                </div>
            );
        }

        return retArr;
    };

    const challengeEntry = challengeEntryMap[presence.puuid];
    const regaliaEntry = regaliaMap[presence.summonerId];

    return (
        <div className={styles.previewSpace}>
            <div className={styles.backgroundImageContainer}>
                {
                    renderBackground(backgroundInfo)
                }
                <div className={styles.backgroundImageFilter}>
                </div>
            </div>
            <div className={styles.bannerArea}>
                <div className={styles.bannerImageContainer}>
                    <img className={styles.bannerImage}
                        src={getBannerUrl(challengeEntry?.bannerId)}/>
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
                            <div className={styles.profileWrapper}>
                                {
                                    renderProfileIcon(regaliaEntry)
                                }
                                {
                                    renderRegalia(regaliaEntry)
                                }
                                {
                                    renderCrystal(challengeEntry)
                                }
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
                                {
                                    challengeEntry?.title?.name
                                }
                            </div>
                            <div className={styles.tokens}>
                                {
                                    renderTokens(challengeEntry)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}