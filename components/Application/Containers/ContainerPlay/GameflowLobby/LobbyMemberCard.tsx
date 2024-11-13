import {ChallengeSummary, LevelMapping, LobbyMember, LobbyState, UserRegalia} from '../../../../../types/Store';
import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowLobby/LobbyMemberCard.module.css';
import * as Globals from '../../../../../Globals';
import ClickableText from '../../../../General/ClickableText';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip, {TooltipProps} from 'react-bootstrap/Tooltip';
import {JSX, RefAttributes} from 'react';
import PrettyImage from '../../../../General/PrettyImage';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../../store';
import axios from 'axios';
import GenericPosition, {Position} from '../../../../General/svg/position/Position';
import {Color} from '../../../../../types/Color';

export interface LobbyMemberCardProps {
    member: LobbyMember | Record<string, never>;
    lobby: LobbyState | null;
}

export default function LobbyMemberCard(props: LobbyMemberCardProps) {
    const DEFAULT_EMPTY_TOKEN_URL = Globals.STATIC_PREFIX + '/assets/png/challenges/background.png';
    const MAXIMUM_TOP_CHALLENGES = 3;

    const regaliaMap = useSelector((state: AppState) => state.userRegalia);
    const challengeSummary = useSelector((state: AppState) => state.challengeSummary);
    const skins = useSelector((state: AppState) => state.skins);

    const challengeData = useSelector((state: AppState) => state.challengeData);

    const member = props.member;
    const regaliaEntry = regaliaMap?.[member?.summonerId ?? ''];
    const challengeEntry = challengeSummary?.[member?.puuid ?? ''];

    const getPositionIconUrl = (position: string) => {
        return Globals.STATIC_PREFIX + '/assets/svg/positions/' + position.toLowerCase() + '.svg';
    };

    const getWingsUrl = (tier: string) => {
        return Globals.STATIC_PREFIX + '/assets/webm/regalia/emblem-wings-magic-' + tier.toLowerCase() + '.webm';
    };
    const getPlateUrl = (tier: string) => {
        return Globals.STATIC_PREFIX + '/assets/png/regalia/plate/wings_' + tier.toLowerCase() + '_plate.png';
    };

    const getPrestigeRegaliaUrl = (selectedCrest: number) => {
        return Globals.STATIC_PREFIX + '/assets/png/regalia/prestige/regalia-prestige-' + selectedCrest + '.png';
    };

    const getRegaliaForMember = (member: LobbyMember | Record<string, never>): UserRegalia | undefined => {
        if (member === undefined || member === null || member.summonerId === undefined) {
            return undefined;
        }

        return regaliaMap[member.summonerId];
    };

    const renderPositionIcons = (lobby: LobbyState | null) => {
        if (lobby.gameConfig?.showQuickPlaySlotSelection) {
            return (
                <div className={styles.playerSlots}>
                    {
                        member?.playerSlots.map((slot, index) => {
                            if (index >= 2) {
                                return (<> </>);
                            }

                            const position = slot.positionPreference;
                            const skin = skins?.[slot.championId * 1000];

                            if (position == undefined || skin == undefined) {
                                return (
                                    <div className={styles.playerSlot} key={index}>
                                    </div>
                                );
                            }

                            return (
                                <div className={styles.playerSlot} key={index}>
                                    <PrettyImage
                                        className={styles.slotImage}
                                        imgProps={{
                                            src: Globals.PROXY_PREFIX + skin.tilePath
                                        }}
                                    />
                                    <div className={styles.slotPosition}>
                                        <GenericPosition
                                            position={Position[position]}
                                            genericProps={{
                                                className: styles.slotPositionImage,
                                                color: Globals.BrandColor.GOLD5.hex,
                                                highlightColor: Globals.BrandColor.GOLD3.hex
                                            }}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            );
        }

        if (lobby.gameConfig?.showPositionSelector) {
            const firstPosition = member?.firstPositionPreference;
            const secondPosition = member?.secondPositionPreference;

            const maxMembers = lobby?.gameConfig?.maxLobbySize ?? 0;
            const currentMemberCount = lobby?.members.filter((member) => member.puuid !== undefined).length ?? 0;
            if (firstPosition === undefined || firstPosition === '') {
                return (<></>);
            }
            if (firstPosition === Globals.LOBBY_POSITIONS.FILL || firstPosition === Globals.LOBBY_POSITIONS.UNSELECTED || maxMembers === currentMemberCount) {
                return (
                    <div className={styles.singlePositionContainer}>
                        <div className={styles.position}>
                            <PrettyImage
                                className={`${styles.positionImage} ${styles.noDrag}`}
                                imgProps={{
                                    src: getPositionIconUrl(firstPosition)
                                }}
                                useLoader={false}/>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className={styles.dualPositionsContainer}>
                        <div className={styles.position}>
                            <PrettyImage
                                imgProps={{
                                    src: getPositionIconUrl(firstPosition),
                                    className: styles.positionImage
                                }}/>
                        </div>
                        <div className={styles.position}>
                            <PrettyImage imgProps={{
                                src: getPositionIconUrl(secondPosition),
                                className: styles.positionImage
                            }}/>
                        </div>
                    </div>
                );
            }
        }
    };

    const renderRankedRegalia = () => {
        return (
            <div className={styles.rankedAnimatedContainer}>
                <video draggable={false} className={`${styles.rankedVideo} ${styles.noDrag}`}
                       src={getWingsUrl(getRegaliaForMember(member)?.highestRankedEntry.tier)} autoPlay={true}
                       controls={false}
                       muted={true} loop={true}/>
                <img draggable={false} className={`${styles.rankedImage} ${styles.noDrag}`}
                     src={getPlateUrl(getRegaliaForMember(member)?.highestRankedEntry.tier)} alt={''}/>
            </div>
        );
    };

    const renderNormalRegalia = () => {
        return (
            <>
                <img className={styles.prestigeImage} draggable={false}
                     src={getPrestigeRegaliaUrl(getRegaliaForMember(member)?.selectedPrestigeCrest ?? Math.floor(Math.min(
                         getRegaliaForMember(member)?.summonerLevel ?? 525,
                         525
                     ) / 25))} alt={''}/>
            </>
        );
    };

    const renderRegaliaTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => {
        return (
            <Tooltip id={'regaliaTooltip'} {...props} className={styles.regaliaTooltip}>
                <div className={styles.full}>

                </div>
            </Tooltip>
        );
    };

    const renderRegalia = (regalia: UserRegalia | undefined) => {

        if (regalia === undefined) {
            console.log(regaliaMap);
            axios.get(Globals.REST_V1_PREFIX + '/managers/map/com.iambadatplaying.data.map.RegaliaManager/' + member.summonerId)
                .then((response) => {
                })
                .catch((error) => {
                });
            return (<></>);
        }

        return (
            <div className={styles.profileContainer}>
                <img draggable={false} className={`${styles.profileImage} ${styles.noDrag}`}
                     src={Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + regalia?.profileIconId + '.jpg'}
                     alt={''}/>
                {regalia?.crestType === 'ranked' ? renderRankedRegalia() : renderNormalRegalia()}
                {
                    renderChallengeIndicator(challengeEntry)
                }
            </div>
        );

    };

    const renderChallengeIndicator = (challengeEntry: ChallengeSummary | undefined) => {
        if (challengeEntry === undefined || challengeEntry === null) {
            console.log(challengeSummary);
            axios.get(Globals.REST_V1_PREFIX + '/managers/map/com.iambadatplaying.data.map.ChallengeSummaryDataManager/' + member.puuid)
                .then((response) => {
                })
                .catch((error) => {
                });
            return (<></>);
        }

        const crystalLevel = challengeEntry.overallChallengeLevel;
        return (
            <div className={styles.crystalContainer}>
                <PrettyImage imgProps={{
                    src: Globals.STATIC_PREFIX + '/assets/png/challenges/crystals/' + crystalLevel.toLowerCase() + '.png'
                }} useLoader={false} className={`${styles.crystalImage} ${styles.noDrag}`}/>
            </div>
        );
    };

    const renderMember = () => {
        const member = props.member;
        return (
            <div>
                {/*Banner*/}
                {/*Regalia*/}
                {renderRegalia(regaliaEntry)}
                {/*Name*/}
                <ClickableText text={member?.gameName + '#' + member?.gameTag} className={styles.displayName}>
                    {member?.gameName}
                </ClickableText>
                <div className={styles.displayPlayerTitle}>
                    {
                        challengeEntry?.title?.name
                    }
                </div>
                <div className={styles.displayPlayerTokens}>
                    {
                        renderChallengeIcons()
                    }
                </div>
                {renderPositionIcons(props.lobby)}
            </div>
        );
    };

    const renderChallengeIcons = () => {
        const arr = [];

        for (let i = 0; i < MAXIMUM_TOP_CHALLENGES; i++) {
            arr.push(
                <div className={styles.singleToken} key={i}>
                    <PrettyImage imgProps={{
                        src: getIconUrl(
                            challengeEntry?.topChallenges[i]?.id,
                            challengeEntry?.topChallenges[i]?.currentLevel
                        )
                    }} useLoader={false} className={styles.tokenImage}/>
                </div>
            );
        }

        return arr;
    };

    const getIconUrl = (id: number | undefined, currentLevel: string | undefined) => {
        if (id === undefined || currentLevel === undefined) {
            return DEFAULT_EMPTY_TOKEN_URL;
        }
        const challenge = challengeData?.challenges[id];
        if (challenge === undefined) {
            return DEFAULT_EMPTY_TOKEN_URL;
        }

        const urlForLevel = challenge.levelToIconPath[currentLevel.toUpperCase()];
        return urlForLevel ? Globals.PROXY_PREFIX + urlForLevel : DEFAULT_EMPTY_TOKEN_URL;
    };

    const renderCard = () => {
        const summonerId = member?.summonerId;

        //Assume no member is present, return empty card
        if (summonerId === null || summonerId === undefined) {
            return (
                <div>
                </div>
            );
        }

        return renderMember();
    };

    return (
        <div className={Globals.applyMultipleStyles(styles.lobbyMemberCard)}>
            {
                renderCard()
            }
        </div>
    );
}