import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import * as Globals from '../../../../Globals';
import styles from '../../../../styles/Application/Containers/ContainerPlay/GameflowLobby.module.css';
import axios from 'axios';
import LobbyMemberCard from './GameflowLobby/LobbyMemberCard';
import {useState} from 'react';
import GamemodeSelector from './GameflowNone/GamemodeSelector';
import {DragType, FriendDragData, GenericDragAndDropData, LobbyState} from '../../../../types/Store';

export interface GameflowLobbyProps {
    inQueue: boolean;
}

export default function GameflowLobby({inQueue}: GameflowLobbyProps) {

    const lobby = useSelector((state: AppState) => state.lobbyState);
    const queues = useSelector((state: AppState) => state.queues);

    const [showGamemodeSelector, setShowGamemodeSelector] = useState<boolean>(false);

    if (lobby === null || queues === null) {
        return (<></>);
    }

    const requestStartMatchmaking = () => {
        axios.post(Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby/matchmaking/search')
            .catch((error) => {
                console.log(
                    '[Start Matchmaking] Error: ',
                    error
                );
            });
    };

    const requestCancelMatchmaking = () => {
        axios.delete(Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby/matchmaking/search')
            .catch((error) => {
                console.log(
                    '[Cancel Matchmaking] Error: ',
                    error
                );
            });
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        if (data === '') {
            return;
        }
        const dragData = JSON.parse(data) as GenericDragAndDropData;
        switch (dragData.key) {
            case DragType.FRIEND:
                break;
            default:
                event.dataTransfer.dropEffect = 'none';
        }
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const data = event.dataTransfer.getData('text/plain');
        console.log(data);
        try {
            const dragData = JSON.parse(data) as GenericDragAndDropData;
            switch (dragData.key) {
                case DragType.FRIEND:
                    // eslint-disable-next-line no-case-declarations
                    const friendData = dragData as FriendDragData;
                    // eslint-disable-next-line no-case-declarations
                    const inviteData = [{'toSummonerId': friendData.data.summonerId}];

                    axios.post(
                        Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby/invitations',
                        inviteData
                    )
                        .then((response) => {
                            console.log('Invited ' + friendData.data.puuid);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    };

    const renderDefaultInviteContainer = () => {
        return (
            <div className={styles.tftSingleGroup}>
                <div className={styles.tftInviteButtonContainer}>
                </div>
            </div>
        )
    }

    const renderTftLocalMember = (lobby: LobbyState | Record<string, never>) => {
        if (!lobby.localMember) {
            return <div className={styles.tftSelfGroup}/>;
        }

        return (
            <div className={styles.tftSelfGroup}>
                <div></div>
            </div>
        )
    }

    const renderTftLobbyMember = (lobby: LobbyState | Record<string, never>, index: number) => {
        if (!lobby.members) {
            return <></>
        }

        if (index >= lobby.members.length) {
            return <></>
        }

        const puuid = lobby.members[index]?.puuid;
        if (!puuid) {
            return renderDefaultInviteContainer();
        }

        if (puuid === lobby.localMember.puuid) return (<></>);

        return (
            <div className={styles.tftSingleGroup}>

            </div>
        )
    }

    const renderTFTLobby = () => {
        return (
            <div className={styles.tftContainer}>
                <div className={styles.tftSubGroup}>
                    {renderTftLobbyMember(lobby, 0)}
                    {renderTftLobbyMember(lobby, 3)}
                    {renderTftLobbyMember(lobby, 6)}
                </div>
                <div className={styles.tftSubGroup}>
                    {renderTftLocalMember(lobby)}
                    {renderTftLobbyMember(lobby, 1)}
                </div>
                <div className={styles.tftSubGroup}>
                    {renderTftLobbyMember(lobby, 2)}
                    {renderTftLobbyMember(lobby, 5)}
                    {renderTftLobbyMember(lobby, 7)}
                </div>

            </div>
        );
    };

    const renderArenaLobby = () => {
        return (
            <></>
        );
    };

    const renderDefaultLobby = () => {
        return (
            <>
                <div className={styles.member_container}
                     onDragOver={e => {
                         onDragOver(e);
                     }}
                     onDrop={e => {
                         onDrop(e);
                     }}
                >
                    {
                        lobby.members?.map(
                            (member, index) => {
                                const key = member.puuid ?? index;
                                return <LobbyMemberCard member={member} key={key}/>;
                            }
                        )
                    }
                </div>
            </>
        );
    };

    const renderContent = () => {
        //This is just for the "form" of the lobby (TFT lobbies should look different from normal lobbies)
        switch (lobby?.gameConfig?.gameMode) {
            case Globals.KNOWN_GAME_MODES.TFT:
                return renderTFTLobby();
            case Globals.KNOWN_GAME_MODES.ARENA:
                return renderArenaLobby();
            case Globals.KNOWN_GAME_MODES.ARAM:
            case Globals.KNOWN_GAME_MODES.CLASSIC:
            //Use standard lobby as fallback
            // eslint-disable-next-line no-fallthrough
            default:
                return renderDefaultLobby();
        }
    };


    const renderCancelOrReadyButton = () => {
        if (inQueue) {
            return (
                <div className={styles.divCancelGameButton} onClick={() => requestCancelMatchmaking()}>
                    Stop Searching
                </div>
            );
        } else {
            return (
                <div className={styles.divStartGameButton} onClick={() => requestStartMatchmaking()}>
                    Find Match
                </div>
            );
        }
    };

    if (showGamemodeSelector) {
        return (
            <GamemodeSelector onClosed={() => {
                setShowGamemodeSelector(false);
            }}/>);
    }

    return (
        <div className={styles.container}>
            <div className={styles.divTop}></div>
            {
                <div className={styles.lobby_type_display} onClick={() => {
                    setShowGamemodeSelector(true);
                }}>
                    Current Gamemode: {queues[lobby.gameConfig?.queueId]?.description}
                </div>
            }
            <div className={styles.divMiddle}>
                {
                    renderContent()
                }
            </div>
            <div className={styles.divBottom}>
                {
                    renderCancelOrReadyButton()
                }
            </div>
        </div>
    );
}