import {LobbyMember, UserRegalia} from '../../../../../types/Store';
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

export interface LobbyMemberCardProps {
    member: LobbyMember | Record<string, never>;
}

export default function LobbyMemberCard(props: LobbyMemberCardProps) {

    const regaliaMap = useSelector((state: AppState) => state.regalia);

    const member = props.member;

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

    const renderPositionIcons = () => {
        const firstPosition = member?.firstPositionPreference;
        const secondPosition = member?.secondPositionPreference;
        if (firstPosition === undefined || firstPosition === '') {
            return (<></>);
        }

        if (firstPosition === Globals.LOBBY_POSITIONS.FILL || firstPosition === Globals.LOBBY_POSITIONS.UNSELECTED) {
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
    };

    const renderRankedRegalia = () => {
        return (
            <div className={styles.rankedAnimatedContainer}>
                <video draggable={false} className={`${styles.rankedVideo} ${styles.noDrag}`}
                    src={getWingsUrl(getRegaliaForMember(member)?.highestRankedEntry.tier)} autoPlay={true} controls={false}
                    muted={true} loop={true}/>
                <img draggable={false} className={`${styles.rankedImage} ${styles.noDrag}`}
                    src={getPlateUrl( getRegaliaForMember(member)?.highestRankedEntry.tier)} alt={''}/>
            </div>
        );
    };

    const renderNormalRegalia = () => {
        return (
            <>
                <img className={styles.prestigeImage} draggable={false}
                    src={getPrestigeRegaliaUrl( getRegaliaForMember(member)?.selectedPrestigeCrest)} alt={''}/>
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

    const renderRegalia = () => {
        const renderedRegalia = getRegaliaForMember(member)?.crestType === 'ranked' ? renderRankedRegalia() : renderNormalRegalia();
        return (
            <div className={styles.profileContainer}>
                <img draggable={false} className={`${styles.profileImage} ${styles.noDrag}`}
                    src={Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + getRegaliaForMember(member)?.profileIconId + '.jpg'}
                    alt={''}/>
                {renderedRegalia}
            </div>
        );

    };

    const renderMember = () => {
        const member = props.member;
        return (
            <div>
                {/*Banner*/}
                {/*Regalia*/}
                {renderRegalia()}
                {/*Name*/}
                <ClickableText text={member?.gameName + '#' + member?.gameTag}>
                    <div className={styles.displayName}>
                        {member?.gameName}
                    </div>
                </ClickableText>
                {renderPositionIcons()}
            </div>
        );
    };

    const renderCard = () => {
        const summonerId = member?.summonerId

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
        <div className={styles.lobbyMemberCard}>
            {
                renderCard()
            }
        </div>
    );
}