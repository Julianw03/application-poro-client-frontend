import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import * as Globals from '../../../../Globals';
import styles from '../../../../styles/Application/Containers/ContainerPlay/GameflowLobby.module.css';
import axios from 'axios';
import LobbyMemberCard from './GameflowLobby/LobbyMemberCard';
import {useState} from 'react';
import GamemodeSelector from './GameflowNone/GamemodeSelector';
import {DragType, FriendDragData, GenericDragAndDropData, LobbyState} from '../../../../types/Store';
import DefaultLobby from './GameflowLobby/DefaultLobby';
import TFTLobby from './GameflowLobby/TFTLobby';
import ArenaLobby from './GameflowLobby/ArenaLobby';

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

    const renderContent = () => {
        //This is just for the "form" of the lobby (TFT lobbies should look different from normal lobbies)
        switch (lobby?.gameConfig?.gameMode) {
            case Globals.KNOWN_GAME_MODES.TFT:
                return <TFTLobby lobby={lobby}/>;
            case Globals.KNOWN_GAME_MODES.ARENA:
                return <ArenaLobby lobby={lobby}/>;
            case Globals.KNOWN_GAME_MODES.ARAM:
            case Globals.KNOWN_GAME_MODES.CLASSIC:
            //Use standard lobby as fallback
            // eslint-disable-next-line no-fallthrough
            default:
                return <DefaultLobby lobby={lobby}/>;
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
            <div className={styles.divMiddle}
                onDragOver={e => {
                    onDragOver(e);
                }}
                onDrop={e => {
                    onDrop(e);
                }}>
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