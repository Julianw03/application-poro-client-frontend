import {GenericPresence, IconOverride, LobbyState, LolPresence, PresenceState} from '../../../../../types/Store';
import styles from '../../../../../styles/Application/Containers/ContainerPlay/GameflowLobby/TFTLobby.module.css';
import {AppState} from '../../../../../store';
import {useSelector} from 'react-redux';
import PrettyImage from '../../../../General/PrettyImage';
import * as Globals from '../../../../../Globals';

export interface TFTLobbyProps {
    lobby: LobbyState | null;
}

export default function TFTLobby({lobby}) {

    const genericPresence = useSelector((state: AppState) => state.genericPresence);
    const selfPresence = useSelector((state: AppState) => state.selfPresence);
    const loadout = useSelector((state: AppState) => state.userLoadoutState);
    const companionsMap = useSelector((state: AppState) => state.companions);
    const tftMapSkins = useSelector((state: AppState) => state.tftMaps);
    const tftDamageSkins = useSelector((state: AppState) => state.tftDamageSkins);


    const renderDefaultInviteContainer = () => {
        return (
            <div className={styles.tftSingleGroupWrapper}>
                <div className={styles.tftSingleGroup}>
                    <div className={styles.tftInviteButtonContainer}>
                        <svg
                            className={styles.tftInviteButtonSvg}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 45.402 45.402">
                            <g>
                                <path
                                    d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    const renderTftLobbyMember = (index: number) => {
        if (!lobby.members) {
            return <></>;
        }

        if (index >= lobby.members.length) {
            return <></>;
        }

        const puuid = lobby.members[index]?.puuid;
        if (!puuid) {
            return renderDefaultInviteContainer();
        }

        if (puuid === lobby.localMember.puuid) {
            return (<></>);
        }

        const presence = genericPresence?.[puuid];

        return (
            <div className={styles.tftSingleGroupWrapper}>
                <div className={styles.tftSingleGroup}>
                    <div className={styles.tftMemberIconSection}>
                        {
                            getDisplayIcon(presence)
                        }
                    </div>
                    <div className={styles.tftMemberNameSection}>
                        {presence.gameName}
                    </div>
                </div>
            </div>
        );
    };

    const getDisplayIcon = (presence: PresenceState | GenericPresence) => {

        const iconOverride = presence?.lol?.iconOverride ?? '';
        switch (iconOverride) {
            case IconOverride.COMPANION_ICON:
                const companionUrl = companionsMap?.[presence?.lol?.companionId]?.loadoutsIcon;
                if (!companionUrl) {
                    return <></>;
                }
                return (
                    <PrettyImage
                        imgProps={{
                            src: Globals.PROXY_STATIC_PREFIX + companionUrl
                        }}
                        className={styles.selfIcon}
                    />
                );
            case IconOverride.SUMMONER_ICON:
                const summonerUrl = Globals.getIconPathUrl(presence?.icon?.toString());
                return (
                    <PrettyImage
                        imgProps={{
                            src: summonerUrl
                        }}
                        className={styles.selfIcon}
                    />
                );
            default:
                return <></>;
        }
    };

    const renderTftLocalMember = () => {
        if (!lobby?.localMember) {
            return <div className={styles.tftSelfGroup}/>;
        }


        const companion = companionsMap?.[loadout?.loadout.COMPANION_SLOT?.itemId ?? 1];
        const mapSkin = tftMapSkins?.[loadout?.loadout.TFT_MAP_SKIN_SLOT?.itemId ?? 1];
        const damageSkin = tftDamageSkins?.[loadout?.loadout.TFT_DAMAGE_SKIN_SLOT?.itemId ?? 1];

        return (
            <div className={styles.tftSelfGroupWrapper}>
                <div className={styles.tftSelfGroup}>
                    <div className={styles.selfIconSection}>
                        {
                            getDisplayIcon(selfPresence)
                        }
                    </div>
                    <div className={styles.selfNameSection}>
                        {selfPresence.gameName}
                    </div>
                    <div className={styles.selfSelection}>
                        <div className={styles.selfTactician}>
                            Tactician
                            <PrettyImage
                                imgProps={{
                                    src: Globals.PROXY_STATIC_PREFIX + companion?.loadoutsIcon
                                }}
                                className={styles.selfEquippedImage}
                            />
                        </div>
                        <div className={styles.selfArena}>
                            Arena Skins
                            <PrettyImage
                                imgProps={{
                                    src: Globals.PROXY_STATIC_PREFIX + mapSkin?.loadoutsIcon
                                }}
                                className={styles.selfEquippedImage}
                            />
                        </div>
                        <div className={styles.selfDamageSkin}>
                            Booms
                            <PrettyImage
                                imgProps={{
                                    src: Globals.PROXY_STATIC_PREFIX + damageSkin?.loadoutsIcon
                                }}
                                className={styles.selfEquippedImage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.tftContainer}>
            <div className={styles.tftSubGroup}>
                {renderTftLobbyMember(0)}
                {renderTftLobbyMember(3)}
                {renderTftLobbyMember(6)}
            </div>
            <div className={styles.tftSubGroup}>
                {renderTftLocalMember()}
                {renderTftLobbyMember(1)}
            </div>
            <div className={styles.tftSubGroup}>
                {renderTftLobbyMember(2)}
                {renderTftLobbyMember(5)}
                {renderTftLobbyMember(7)}
            </div>
        </div>
    );
}