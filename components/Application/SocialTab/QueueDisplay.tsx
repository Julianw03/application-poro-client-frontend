import {AppState} from '../../../store';
import * as Globals from '../../../Globals';
import styles from '../../../styles/Application/SocialTab/QueueDisplay.module.css';
import {useSelector} from 'react-redux';
import axios from 'axios';
import PrettyVideo from '../../General/PrettyVideo';
import PrettyImage from '../../General/PrettyImage';

export default function QueueDisplay() {

    const gameflowState = useSelector((state: AppState) => state.gameflowState);
    const matchmakingState = useSelector((state: AppState) => state.matchmakingSearchState);
    const lobbyState = useSelector((state: AppState) => state.lobbyState);
    const queues = useSelector((state: AppState) => state.queues);
    const mapAssets = useSelector((state: AppState) => state.mapAssets);

    const renderActivityName = () => {
        const gameMode = lobbyState?.gameConfig?.queueId ? queues[lobbyState?.gameConfig?.queueId]?.description : '';
        return gameMode;
    };

    const renderMemberIcons = () => {
        const totalCount = lobbyState?.members?.length ?? 0;
        const memberCount = lobbyState?.members?.filter((member) => member?.puuid)?.length ?? 0;

        const returnedMembers = [];

        for (let i = 0; i < totalCount; i++) {
            if (i >= memberCount) {
                returnedMembers.push(
                    <div className={styles.partiesSingleUser} key={i}>
                        <svg className={styles.fullImage} viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z"
                                stroke="#6e6e6e" strokeOpacity="1" strokeWidth="2" fill="#6e6e6e"
                                fillOpacity="1"/>
                            <path
                                d="M5 19.5C5 15.9101 7.91015 13 11.5 13H12.5C16.0899 13 19 15.9101 19 19.5V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V19.5Z"
                                stroke="#6e6e6e" strokeOpacity="1" strokeWidth="0" fill="#6e6e6e"
                                fillOpacity="1"/>
                        </svg>
                    </div>
                );
            } else {
                returnedMembers.push(
                    <div className={styles.partiesSingleUser} key={i}>
                        <svg className={styles.fullImage} viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z"
                                stroke="#FAFAFA" strokeWidth="2" fill="#FAFAFA"/>
                            <path
                                d="M5 19.5C5 15.9101 7.91015 13 11.5 13H12.5C16.0899 13 19 15.9101 19 19.5V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V19.5Z"
                                stroke="#FAFAFA" strokeWidth="0" fill="#FAFAFA"/>
                        </svg>
                    </div>
                );
            }
        }

        return returnedMembers;
    };

    const renderMemberCount = () => {
        const totalCount = lobbyState?.members?.length;
        const memberCount = lobbyState?.members?.filter((member) => member?.puuid).length;

        return (
            <div className={styles.textMemberCount}>
                <div className={styles.partiesSingleUser}>
                    <svg className={styles.fullImage} viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z"
                            stroke="#FAFAFA" strokeWidth="2" fill="#FAFAFA"/>
                        <path
                            d="M5 19.5C5 15.9101 7.91015 13 11.5 13H12.5C16.0899 13 19 15.9101 19 19.5V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V19.5Z"
                            stroke="#FAFAFA" strokeWidth="0" fill="#FAFAFA"/>
                    </svg>
                </div>
                <div className={styles.textAlignContainer}>
                    {memberCount} / {totalCount}
                </div>
            </div>
        );
    };

    const renderLobbyMemberCount = () => {
        if (lobbyState == null) {
            return <div className={styles.hidden}></div>;
        }

        if (lobbyState?.members?.length <= 8) {
            return renderMemberIcons();
        }

        return renderMemberCount();
    };

    const renderLobbyInfo = () => {
        if (lobbyState?.gameConfig?.isCustom) {
            return (<div className={styles.hidden}>
                Test
            </div>);
        }

        return (
            <div className={styles.containerLobby}>
                <div className={styles.flexShort}>
                    <div className={styles.iconContainerLobby}>
                        <PrettyImage imgProps={
                            {
                                className: styles.iconImage,
                                src: Globals.getGameSelectIconActive(
                                    mapAssets,
                                    lobbyState?.gameConfig?.mapId,
                                    lobbyState?.gameConfig?.gameMode
                                )
                            }
                        }/>
                    </div>
                </div>
                <div className={styles.flexLong}>
                    <div className={styles.absoluteWrapper}>
                        <div className={styles.spacer}/>
                        <div className={styles.lobbyMemberDisplayContainer}>
                            {
                                renderLobbyMemberCount()
                            }
                        </div>
                        <div className={styles.lobbyNameDisplay}>
                            {
                                renderActivityName()
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const requestCancelQueue = () => {
        axios.delete(Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby/matchmaking/search')
            .catch((error) => {
                console.log(
                    '[Cancel Queue] Error: ',
                    error
                );
            });
    };

    const renderQueueSecondsPretty = (passedSeconds: number) => {
        const secondsFixed = Math.round(passedSeconds);

        const seconds = secondsFixed % 60;
        const minutes = Math.floor(secondsFixed / 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const renderQueueInfo = () => {
        if (!matchmakingState?.isCurrentlyInQueue) {
            return (
                <div className={Globals.applyMultipleStyles(
                    styles.container,
                    styles.delayedQueue
                )}>
                    <div className={styles.flexShort}>
                        <div className={styles.iconContainer}>
                            <PrettyVideo videoProps={
                                {
                                    className: styles.iconVideo,
                                    autoPlay: true,
                                    muted: true,
                                    loop: true,
                                    src: Globals.getGameSelectVideoActive(
                                        mapAssets,
                                        lobbyState?.gameConfig?.mapId,
                                        lobbyState?.gameConfig?.gameMode
                                    ),
                                    poster: Globals.getGameSelectIconActive(
                                        mapAssets,
                                        lobbyState?.gameConfig?.mapId,
                                        lobbyState?.gameConfig?.gameMode
                                    )
                                }
                            }/>
                        </div>
                    </div>
                    <div className={styles.flexLong}>
                        <div className={styles.absoluteWrapper}>
                            <div className={styles.inQueueText}>
                                Low Priority Queue
                            </div>
                            <div className={styles.timeInQueueText}>
                                {renderQueueSecondsPretty(matchmakingState?.lowPriorityData?.penaltyTime - matchmakingState?.lowPriorityData?.penaltyTimeRemaining)}
                            </div>
                            <div className={styles.expectedTimeText}>
                                Penalty Time&nbsp;
                                {
                                    renderQueueSecondsPretty(matchmakingState?.lowPriorityData?.penaltyTime ?? 0)
                                }
                            </div>
                            <div className={styles.cancelQueueContainer}>
                                <button type={'button'} className={styles.closeButton} onClick={requestCancelQueue}
                                        aria-label="Close"></button>
                            </div>
                        </div>

                    </div>
                </div>
            );
        }

        return (
            <div className={styles.container}>
                <div className={styles.flexShort}>
                    <div className={styles.iconContainer}>
                        <PrettyVideo videoProps={
                            {
                                className: styles.iconVideo,
                                autoPlay: true,
                                muted: true,
                                loop: true,
                                src: Globals.getGameSelectVideoActive(
                                    mapAssets,
                                    lobbyState?.gameConfig?.mapId,
                                    lobbyState?.gameConfig?.gameMode
                                )
                                ,
                                poster: Globals.getGameSelectIconActive(
                                    mapAssets,
                                    lobbyState?.gameConfig?.mapId,
                                    lobbyState?.gameConfig?.gameMode
                                )
                            }
                        }/>
                    </div>
                </div>
                <div className={styles.flexLong}>
                    <div className={styles.absoluteWrapper}>
                        <div className={styles.inQueueText}>
                            Finding Match
                        </div>
                        <div className={styles.timeInQueueText}>
                            {renderQueueSecondsPretty(matchmakingState?.timeInQueue ?? 0)}
                        </div>
                        <div className={styles.expectedTimeText}>
                            Estimated Time:&nbsp;
                            {
                                renderQueueSecondsPretty(matchmakingState?.estimatedQueueTime ?? 0)
                            }
                        </div>
                        <div className={styles.cancelQueueContainer}>
                            <button type={'button'} className={styles.closeButton} onClick={requestCancelQueue}
                                    aria-label="Close"></button>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (gameflowState?.phase) {
            case Globals.GAMEFLOW_READY_CHECK:
            case Globals.GAMEFLOW_MATCHMAKING:
                return renderQueueInfo();
            case Globals.GAMEFLOW_LOBBY:
                return renderLobbyInfo();
            default:
                return <div className={styles.hidden}>
                </div>;
        }
    };

    return (
        renderContent()
    );
}