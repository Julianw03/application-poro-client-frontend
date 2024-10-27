import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import styles from '../styles/App.module.css';
import * as Globals from '../Globals';
import {
    ACTION_RESET_CHALLENGE_DATA, ACTION_RESET_CHALLENGE_SUMMARY,
    ACTION_RESET_CHAMP_SELECT_STATE,
    ACTION_RESET_CHAMPIONS,
    ACTION_RESET_CURRENT_SUMMONER,
    ACTION_RESET_FRIEND_GROUPS,
    ACTION_RESET_FRIENDS,
    ACTION_RESET_GAMEFLOW_STATE,
    ACTION_RESET_INVITATIONS,
    ACTION_RESET_LOBBY_STATE,
    ACTION_RESET_LOOT_STATE,
    ACTION_RESET_PATCHER_STATE, ACTION_RESET_QUEUES, ACTION_RESET_REGALIA,
    ACTION_RESET_SELF_PRESENCE,
    ACTION_RESET_SUMMONER_SPELLS, ACTION_RESET_TICKER_MESSAGES,
    ACTION_SET_ALL_DATA_LOADED,
    ACTION_SET_CHALLENGE_DATA, ACTION_SET_CHALLENGE_SUMMARY,
    ACTION_SET_CHAMP_SELECT_STATE,
    ACTION_SET_CHAMPIONS,
    ACTION_SET_CHROMA_TO_PARENT_SKIN,
    ACTION_SET_CURRENT_SUMMONER,
    ACTION_SET_FRIEND_GROUPS,
    ACTION_SET_FRIENDS,
    ACTION_SET_GAMEFLOW_STATE,
    ACTION_SET_HONOR_EOG_STATE,
    ACTION_SET_INTERNAL_STATE,
    ACTION_SET_INVITATIONS,
    ACTION_SET_LOBBY_STATE,
    ACTION_SET_LOOT_STATE,
    ACTION_SET_MAP_ASSETS,
    ACTION_SET_MATCHMAKING_SEARCH_STATE,
    ACTION_SET_OWNED_CHAMPIONS,
    ACTION_SET_OWNED_SKINS,
    ACTION_SET_PATCHER_STATE,
    ACTION_SET_QUEUES, ACTION_SET_QUEUES_TYPE_TO_ID,
    ACTION_SET_REGALIA,
    ACTION_SET_SELF_PRESENCE, ACTION_SET_SINGLE_QUEUE, ACTION_SET_SINGLE_QUEUE_TYPE_TO_ID, ACTION_SET_SINGLE_REGALIA,
    ACTION_SET_SKINS,
    ACTION_SET_SKINS_BY_CHAMPION,
    ACTION_SET_SUMMONER_SPELLS,
    ACTION_SET_TICKER_MESSAGES, ACTION_UPDATE_CHALLENGE_SUMMARY_SINGLE, ACTION_UPDATE_FRIEND_GROUPS_SINGLE,
    ACTION_UPDATE_FRIEND_SINGLE, ACTION_UPDATE_PRESENCE_SINGLE,
    AppState, ChallengeSummaryUpdateData, FriendGroupUpdateData, FriendUpdateData, QueueUpdateData, RegaliaUpdateData
} from '../store';
import {
    ChallengeData, ChallengeSummary, ChallengeSummaryState,
    ChampionState,
    ChampSelectState,
    CurrentSummonerState,
    EOGHonorState,
    Friend,
    FriendGroup,
    GameflowState, ID,
    InternalState,
    Invitation,
    LobbyState,
    LootState,
    MatchmakingSearchState,
    MinimalChampion,
    OwnedChampion,
    OwnedChampionState,
    OwnedSkin,
    PatcherState,
    PresenceState, PUUID,
    Queue, Regalia, RegaliaJsonData,
    RemoteMapAssets,
    Skin,
    SummonerSpell,
    TickerMessage
} from '../types/Store';
import {useEffect, useState} from 'react';
import DynamicBackground from '../components/DynamicBackground';
import Application from '../components/Application';
import LoadingComponent from '../components/LoadingComponent';
import PersistentMenu from './PersistentMenu';
import ReworkedMusicSystem, {DefaultSound, SoundScope} from './Audio/ReworkedMusicSystem';
import MusicManager from './MusicManager';
import {BACKEND_STATE_DISCONNECTED} from '../Globals';

export default function App() {

    const dispatch = useDispatch();

    const internalState = useSelector((state: AppState) => state.internalState);
    const allDataLoaded = useSelector((state: AppState) => state.allDataLoaded);
    const [connected, setConnected] = useState(false);


    let socket: WebSocket;

    interface Message {
        event: string;
        data: object | object[] | string | number | boolean | null;
    }

    interface SingleKeyUpdateMessage {
        event: string;
        key: string;
        data: object | object[] | string | number | boolean | null;
    }

    const handleVisibilityChange = () => {
        if (document.hidden) {
            console.log('The tab is now inactive.');
            console.log('Websocket messages may be ignored!');
        } else {
            //TODO: Handle refreshing of all data as soon as the tab is active again, some websocket messages may have been missed
            console.log('The tab is now active.');
        }
    };

    useEffect(
        () => {
            document.addEventListener(
                'visibilitychange',
                handleVisibilityChange
            );

            document.body.style.overflow = 'hidden';
            setTimeout(
                () => {
                    console.log('Initiating WebSocket Connection!');
                    connect();
                },
                1000
            );

            return () => {

                ReworkedMusicSystem.getInstance().shutdown();
                document.removeEventListener(
                    'visibilitychange',
                    handleVisibilityChange
                );

                if (socket === undefined) {
                    return;
                }
                socket.onclose = function () {
                };
                socket.close();
            };
        },
        []
    );

    useEffect(
        () => {
            if (!connected) {
                resetStates();
            }
        },
        [connected]
    );


    useEffect(
        () => {
            if (internalState?.state != Globals.BACKEND_STATE_CONNECTED) {
                return;
            }
            fetchStaticData();
        },
        [internalState]
    );

    function resetStates() {
        dispatch(ACTION_SET_INTERNAL_STATE(
            {
                state: Globals.BACKEND_STATE_STARTING
            }
        ));
        dispatch(
            ACTION_SET_ALL_DATA_LOADED(
                false
            )
        );
        dispatch(ACTION_RESET_CHAMP_SELECT_STATE());
        dispatch(ACTION_RESET_CHAMPIONS());
        dispatch(ACTION_RESET_SUMMONER_SPELLS());
        dispatch(ACTION_RESET_REGALIA());
        dispatch(ACTION_RESET_CHALLENGE_DATA());
        dispatch(ACTION_RESET_CURRENT_SUMMONER());
        dispatch(ACTION_RESET_SELF_PRESENCE());
        dispatch(ACTION_RESET_GAMEFLOW_STATE());
        dispatch(ACTION_RESET_PATCHER_STATE());
        dispatch(ACTION_RESET_FRIENDS());
        dispatch(ACTION_RESET_FRIEND_GROUPS());
        dispatch(ACTION_RESET_LOBBY_STATE());
        dispatch(ACTION_RESET_LOOT_STATE());
        dispatch(ACTION_RESET_INVITATIONS());
        dispatch(ACTION_RESET_TICKER_MESSAGES());
        dispatch(ACTION_RESET_CHALLENGE_SUMMARY());
        dispatch(ACTION_RESET_QUEUES());
    }

    const handleMessage = (messageText: string) => {
        if (messageText === '') {
            return;
        }
        try {
            const message: Message = JSON.parse(messageText);
            console.log(message);
            switch (message.event) {
                case Globals.UPDATES.INITIAL_FRIEND_LIST_UPDATE:
                    dispatch(
                        ACTION_SET_FRIENDS(
                            message.data as Record<string, Friend>
                        )
                    );
                    break;
                case Globals.UPDATES.FRIEND_UPDATE:
                    const friendUpdate = message as unknown as FriendUpdateData;
                    dispatch(
                        ACTION_UPDATE_FRIEND_SINGLE(
                            friendUpdate
                        )
                    );
                    break;
                case Globals.UPDATES.SELF_PRESENCE_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_SELF_PRESENCE(
                            message.data as PresenceState
                        )
                    );
                    break;
                case Globals.UPDATES.LOBBY_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_LOBBY_STATE(
                            message.data as LobbyState
                        )
                    );
                    break;
                case Globals.UPDATES.REGALIA_UPDATE:
                    dispatch(
                        ACTION_SET_REGALIA(
                            message.data as RegaliaJsonData
                        )
                    );
                    break;
                case Globals.UPDATES.SINGLE_REGALIA_UPDATE:
                    dispatch(
                        ACTION_SET_SINGLE_REGALIA(
                            message as unknown as RegaliaUpdateData
                        )
                    );
                    break;
                case Globals.UPDATES.CHAMPION_SELECT_UPDATE:
                    dispatch(
                        ACTION_SET_CHAMP_SELECT_STATE(
                            message.data as ChampSelectState
                        )
                    );
                    break;
                case Globals.UPDATES.LOOT_UPDATE:
                    dispatch(
                        ACTION_SET_LOOT_STATE(
                            message.data as (LootState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.PATCHER_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_PATCHER_STATE(
                            message.data as PatcherState
                        )
                    );
                    break;
                case Globals.UPDATES.INTERNAL_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_INTERNAL_STATE(
                            message.data as InternalState
                        )
                    );
                    break;
                case Globals.UPDATES.TICKER_MESSAGE_ARRAY_UPDATE:
                    dispatch(
                        ACTION_SET_TICKER_MESSAGES(
                            message.data as TickerMessage[]
                        )
                    );
                    break;
                case Globals.UPDATES.INVITATIONS_ARRAY_UPDATE:
                    dispatch(
                        ACTION_SET_INVITATIONS(
                            message.data as Invitation[]
                        )
                    );
                    break;
                case Globals.UPDATES.FRIEND_GROUP_UPDATE:
                    dispatch(
                        ACTION_UPDATE_FRIEND_GROUPS_SINGLE(
                            message as unknown as FriendGroupUpdateData
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_FRIEND_GROUP_UPDATE:
                    dispatch(
                        ACTION_SET_FRIEND_GROUPS(
                            message.data as FriendGroup[]
                        )
                    );
                    break;
                case Globals.UPDATES.CURRENT_SUMMONER_UPDATE:
                    dispatch(
                        ACTION_SET_CURRENT_SUMMONER(
                            message.data as CurrentSummonerState
                        )
                    );
                    break;
                case Globals.UPDATES.MATCHMAKING_SEARCH_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_MATCHMAKING_SEARCH_STATE(
                            message.data as MatchmakingSearchState
                        )
                    );
                    break;
                case Globals.UPDATES.HONOR_EOG_UPDATE:
                    dispatch(
                        ACTION_SET_HONOR_EOG_STATE(
                            message.data as EOGHonorState
                        )
                    );
                    break;
                case Globals.UPDATES.GAMEFLOW_PHASE_UPDATE:
                    dispatch(
                        ACTION_SET_GAMEFLOW_STATE(
                            message.data as GameflowState
                        )
                    );
                    break;
                case Globals.UPDATES.QUEUE_UPDATE:
                    const queues = message.data as Record<number, Queue>;
                    dispatch(
                        ACTION_SET_QUEUES(
                            queues
                        )
                    );
                    dispatch(
                        ACTION_SET_QUEUES_TYPE_TO_ID(
                            queues
                        )
                    );
                    break;
                case Globals.UPDATES.SINGLE_QUEUE_UPDATE:
                    const queueUpdate = message as unknown as QueueUpdateData;
                    dispatch(
                        ACTION_SET_SINGLE_QUEUE(
                            queueUpdate
                        )
                    );
                    dispatch(
                        ACTION_SET_SINGLE_QUEUE_TYPE_TO_ID(
                            queueUpdate
                        )
                    );
                    break;
                case Globals.UPDATES.OWNED_CHAMPIONS_UPDATE:
                    // eslint-disable-next-line no-case-declarations
                    const ownedChampions = message.data as OwnedChampion[];
                    // eslint-disable-next-line no-case-declarations
                    const championState = {} as OwnedChampionState;
                    ownedChampions.forEach((ownedChampion) => {
                        championState[ownedChampion.itemId] = ownedChampion;
                    });

                    console.log(championState);
                    dispatch(
                        ACTION_SET_OWNED_CHAMPIONS(
                            championState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_FRIEND_HOVERCARD_UPDATE:
                    break;
                case Globals.UPDATES.FRIEND_HOVERCARD_UPDATE:
                    break;
                case Globals.UPDATES.GENERIC_PRESENCE_UPDATE:
                    // eslint-disable-next-line no-case-declarations
                    const updatedPresence = message as unknown as FriendUpdateData;
                    dispatch(
                        ACTION_UPDATE_PRESENCE_SINGLE(
                            updatedPresence
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_GENERIC_PRESENCE_UPDATE:
                    break;
                case Globals.UPDATES.OWNED_SKINS_UPDATE:
                    // eslint-disable-next-line no-case-declarations
                    const ownedSkins = message.data as OwnedSkin[];
                    // eslint-disable-next-line no-case-declarations
                    const skinState = {} as Record<number, OwnedSkin>;

                    ownedSkins.forEach((ownedSkin) => {
                        skinState[ownedSkin.itemId] = ownedSkin;
                    });

                    console.log(skinState);
                    dispatch(
                        ACTION_SET_OWNED_SKINS(
                            skinState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_CHALLENGE_SUMMARY_UPDATE:
                    dispatch(
                        ACTION_SET_CHALLENGE_SUMMARY(
                            message.data as ChallengeSummaryState
                        )
                    );
                    break;
                case Globals.UPDATES.CHALLENGE_SUMMARY_UPDATE:
                    const challengeUpdate = message.data as ChallengeSummaryUpdateData;
                    dispatch(
                        ACTION_UPDATE_CHALLENGE_SUMMARY_SINGLE(
                            challengeUpdate
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_UPDATES_DONE_UPDATE:
                    dispatch(
                        ACTION_SET_ALL_DATA_LOADED(
                            true
                        )
                    );
                    break;
                default:
                    console.log('Unknown Event: ' + message.event);
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    };

    function connect() {
        const host = Globals.WEBSOCKET_URL;
        socket = new WebSocket(host);
        socket.onopen = function () {
            setConnected(true);
            console.log('Connected to ' + host);
            createKeepAlive();
        };
        socket.onmessage = function (msg) {
            handleMessage(msg.data);
        };
        socket.onclose = function () {
            setConnected(false);
            setTimeout(
                () => {
                    connect();
                },
                5000
            );
            console.log('Disconnected from Host!');
        };
        socket.onerror = function () {
        };
    }

    const fetchSkins = () => {
        console.log('[Fetch] Skins');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/skins.json')
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Skins');
                    return;
                }
                console.log(response.data);
                console.log('[Fetch] Skins - Done');
                const skins = response.data as Record<string, Skin>;

                const skinsByChampionId = {} as Record<number, number[]>;
                const chromaToParentSkin = {} as Record<number, number>;

                Object.entries(skins).forEach(([skinId, skin]) => {
                    const skinIdNumber = parseInt(skinId);

                    //Champion ID are included in the skin id like this {championId}000
                    const championId = Math.floor(skinIdNumber / 1000);

                    if (skinsByChampionId[championId] === undefined) {
                        skinsByChampionId[championId] = [];
                    }
                    skinsByChampionId[championId].push(skin.id);

                    chromaToParentSkin[skin.id] = skinIdNumber;
                    if (skin.chromas) {
                        for (const chroma of skin.chromas) {
                            chromaToParentSkin[chroma.id] = skinIdNumber;
                        }
                    }
                });


                dispatch(
                    ACTION_SET_SKINS(
                        skins
                    )
                );

                dispatch(
                    ACTION_SET_SKINS_BY_CHAMPION(
                        skinsByChampionId
                    )
                );

                dispatch(
                    ACTION_SET_CHROMA_TO_PARENT_SKIN(
                        chromaToParentSkin
                    )
                );

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchMapAssets = () => {
        console.log('[Fetch] Map Assets');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/map-assets/map-assets.json')
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Map Assets');
                    return;
                }
                const fetchedMapAssets = Globals.getMapAssetsFromRemoteMapAssets(response.data as RemoteMapAssets);
                console.log(fetchedMapAssets);
                console.log('[Fetch] Map Assets - Done');
                dispatch(
                    ACTION_SET_MAP_ASSETS(
                        fetchedMapAssets
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchChampions = () => {
        console.log('[Fetch] Champions');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/champion-summary.json')
            .then((response) => {
                const intermediate: ChampionState = {};
                if (response.data.errorCode) {
                    console.error('Failed to load Champions');
                    return;
                }
                response.data.forEach((champion: MinimalChampion) => {
                    if (champion.id === -1) {
                        return;
                    }
                    intermediate[champion.id] = champion;
                });
                console.log(intermediate);
                console.log('[Fetch] Champions - Done');
                dispatch(
                    ACTION_SET_CHAMPIONS(
                        intermediate
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchSummonerSpells = () => {
        console.log('[Fetch] Summoner Spells');
        axios.get(
            Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/summoner-spells.json'
        )
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Summoner Spells');
                    return;
                }

                const idToSummonerSpell = {} as Record<number, SummonerSpell>;

                response.data.forEach((summonerSpell: SummonerSpell) => {
                    idToSummonerSpell[summonerSpell.id] = summonerSpell;
                });

                console.log(response.data);
                console.log('[Fetch] Summoner Spells - Done');
                dispatch(
                    ACTION_SET_SUMMONER_SPELLS(
                        idToSummonerSpell
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchChallengeData = () => {
        console.log('[Fetch] Challenges');
        axios.get(
            Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/challenges.json'
        )
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Challenges');
                    return;
                }

                console.log(response.data);
                console.log('[Fetch] Challenges - Done');
                dispatch(
                    ACTION_SET_CHALLENGE_DATA(
                        response.data as ChallengeData
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchRegaliaData = () => {
        console.log('[Fetch] Regalia');
        axios.get(
            Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/regalia.json'
        )
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Challenges');
                    return;
                }

                console.log(response.data);

                const allRegalias = response.data as Regalia[];
                const regaliaState = {} as RegaliaJsonData;
                allRegalias.forEach((regalia) => {
                    if (regalia.id === '') {
                        return;
                    }
                    if (regaliaState[regalia.id] === undefined) {
                        regaliaState[regalia.id] = {
                            id: regalia.id,
                            secondaryMap: {}
                        };
                    }

                    if (regalia.idSecondary === '') {
                        regaliaState[regalia.id].default = regalia;
                        return;
                    } else if (regalia.id === '2' && regalia.idSecondary === 'UNRANKED') {
                        regaliaState[regalia.id].default = regalia;
                    }

                    regaliaState[regalia.id].secondaryMap[regalia.idSecondary] = regalia;
                });

                console.log(regaliaState);
                console.log('[Fetch] Regalia - Done');
                dispatch(
                    ACTION_SET_REGALIA(
                        regaliaState
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    function fetchStaticData() {
        fetchChampions();
        fetchSkins();
        fetchSummonerSpells();
        fetchMapAssets();
        fetchChallengeData();
        fetchRegaliaData();
    }

    function createKeepAlive() {
        setTimeout(
            createKeepAlive,
            250000
        );
        socket.send(JSON.stringify([]));
    }

    const renderContent = () => {
        switch (internalState?.state) {
            case Globals.BACKEND_STATE_CONNECTED:
                if (!allDataLoaded) {
                    return <LoadingComponent/>;
                }

                return <>
                    <Application/>
                    <DynamicBackground/>
                </>;
            default:
                return <LoadingComponent/>;
        }
    };

    return (
        <div className={styles.container}>
            <MusicManager/>
            <PersistentMenu/>
            {
                renderContent()
            }
        </div>
    );
}