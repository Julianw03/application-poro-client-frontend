import {configureStore, createAction, createReducer} from '@reduxjs/toolkit';
import {
    ActiveContainerState,
    ChallengeData, ChallengeSummaryState,
    ChampionState,
    ChampSelectState,
    ContainerState,
    CurrentSummonerState,
    EOGHonorState,
    Friend,
    FriendGroup,
    GameflowState,
    GenericPresenceState, ID,
    InternalState,
    Invitation,
    LobbyState,
    LootState,
    MapAssets,
    MatchmakingSearchState,
    OwnedChampionState,
    OwnedSkinState,
    PatcherState,
    PresenceState,
    PUUID,
    Queue, RegaliaJsonData,
    RemoteMapAssets, SingleChallengeUpdate,
    Skin, SUMMONER_ID,
    SummonerSpell,
    SummonerSpellState,
    TickerMessage, UserRegalia, UserRegaliaMap,
    WindowFocusState
} from './types/Store';
import * as Globals from './Globals';

// eslint-disable @typescript-eslint/no-unused-vars
export interface AppState {
    //========= STATIC =========
    mapAssets: MapAssets | Record<string, never>,
    summonerSpells: SummonerSpellState | null,
    regalia: UserRegaliaMap | null,
    skins: Record<number, Skin>
    queues: Record<number, Queue>
    queueTypeToId: Record<string, number>
    champions: ChampionState | null
    challengeData: ChallengeData | null

    //========= STATIC MAPS =========
    skinsByChampion: Record<number, number[]>
    chromaToParentSkin: Record<number, number>

    //========= DYNAMIC =========
    internalState: InternalState | Record<string, never>,
    friends: Record<PUUID, Friend>,
    friendGroups: Record<number, FriendGroup>
    selfPresence: PresenceState | null,
    gameflowState: GameflowState | null,
    patcherState: PatcherState | null,
    lobbyState: LobbyState | Record<string, never>,
    lootState: LootState | null,
    matchmakingSearchState: MatchmakingSearchState | null,
    invitations: Invitation[] | null,
    tickerMessages: TickerMessage[] | null,
    currentSummoner: CurrentSummonerState | null
    honorEOGState: EOGHonorState | null,
    champSelectState: ChampSelectState | null,
    challengeSummary: ChallengeSummaryState | null,

    genericPresence: GenericPresenceState | null,

    //--- INVENTORY ---
    // ownedIcons: object[],
    // ownedWards: object[],
    // ownedEmotes: object[],
    ownedSkins: OwnedSkinState | null,
    ownedChampions: OwnedChampionState | null,

    //--- UI STATES ---
    windowFocused: WindowFocusState,
    allDataLoaded: boolean,
    activeContainer: ActiveContainerState
}

export interface FriendUpdateData {
    id: ID,
    data: Friend
}

export interface FriendGroupUpdateData {
    id: number,
    group: FriendGroup
}

export interface QueueUpdateData {
    id: number,
    queue: Queue
}

export interface ChallengeSummaryUpdateData {
    puuid: PUUID,
    challengeSummary: ChallengeSummaryState
}

export interface RegaliaUpdateData {
    id: SUMMONER_ID;
    data: UserRegalia;
}

const INITIAL_MAP_ASSETS_STATE = null;
const INITIAL_SUMMONER_SPELLS = null;
const INITIAL_REGALIA_STATE = null;
const INITIAL_SKIN_STATE = null;
const INITIAL_QUEUES = null;
const INITIAL_QUEUES_TYPE_TO_ID = null;
const INITIAL_CHAMPION_STATE = null;
const INITIAL_CHALLENGE_DATA = null;

const INITIAL_SKINS_BY_CHAMPION = null;
const INITIAL_CHROMA_TO_PARENT_SKIN = null;

const INITIAL_OWNED_CHAMPIONS = null;

const INITIAL_PRESENCE_STATE = null;

const INITIAL_PATCHER_STATE = null;

const INITIAL_FRIENDS_STATE = null;

const INITIAL_FRIEND_GROUP_STATE = {} as Record<number, FriendGroup> | Record<number, never>;

const INITIAL_GAMEFLOW_STATE = null;

const INITIAL_INTERNAL_STATE = null;

const INITIAL_LOBBY_STATE = null;

const INITIAL_LOOT_STATE = null;

const INITIAL_INVITATIONS = null;

const INITIAL_TICKER_MESSAGES = null;

const INITIAL_HONOR_EOG_STATE = null;

const INITIAL_WINDOW_FOCUSED = {focused: true} as WindowFocusState;

const INITIAL_ACTIVE_CONTAINER = {container: ContainerState.NONE} as ActiveContainerState;

const INITIAL_CURRENT_SUMMONER = null;

const INITIAL_MATCHMAKING_SEARCH_STATE = null;

const INITIAL_CHAMP_SELECT_STATE = null;

const INITIAL_GENERIC_PRESENCE_STATE = null;

const INITIAL_CHALLENGE_SUMMARY_STATE = null;

const INITIAL_ALL_DATA_LOADED = false;

export const ACTION_SET_MAP_ASSETS = createAction<MapAssets>('mapAssets/set');
export const ACTION_RESET_MAP_ASSETS = createAction('mapAssets/reset');

export const ACTION_SET_SUMMONER_SPELLS = createAction<SummonerSpellState>('summonerSpells/set');
export const ACTION_RESET_SUMMONER_SPELLS = createAction('summonerSpells/reset');

export const ACTION_SET_REGALIA = createAction<RegaliaJsonData>('regalia/set');
export const ACTION_SET_SINGLE_REGALIA = createAction<RegaliaUpdateData>('regalia/setSingle');
export const ACTION_RESET_REGALIA = createAction('regalia/reset');

export const ACTION_SET_SKINS = createAction<Record<number, Skin>>('skins/set');
export const ACTION_RESET_SKINS = createAction('skins/reset');

export const ACTION_SET_QUEUES = createAction<Record<number, Queue>>('queues/set');
export const ACTION_SET_SINGLE_QUEUE = createAction<QueueUpdateData>('queues/setSingle');
export const ACTION_RESET_QUEUES = createAction('queues/reset');

export const ACTION_SET_QUEUES_TYPE_TO_ID = createAction<Record<number, Queue>>('queueTypeToId/set');
export const ACTION_SET_SINGLE_QUEUE_TYPE_TO_ID = createAction<QueueUpdateData>('queueTypeToId/setSingle');
export const ACTION_RESET_QUEUES_TYPE_TO_ID = createAction('queueTypeToId/reset');

export const ACTION_SET_CHAMPIONS = createAction<ChampionState>('champions/set');
export const ACTION_RESET_CHAMPIONS = createAction('champions/reset');

export const ACTION_SET_CHALLENGE_DATA = createAction<ChallengeData>('challengeData/set');
export const ACTION_RESET_CHALLENGE_DATA = createAction('challengeData/reset');

export const ACTION_SET_OWNED_SKINS = createAction<OwnedSkinState>('ownedSkins/set');
export const ACTION_RESET_OWNED_SKINS = createAction('ownedSkins/reset');

export const ACTION_SET_OWNED_CHAMPIONS = createAction<OwnedChampionState>('ownedChampions/set');
export const ACTION_RESET_OWNED_CHAMPIONS = createAction('ownedChampions/reset');

export const ACTION_SET_SKINS_BY_CHAMPION = createAction<Record<number, number[]>>('skinsByChampion/set');
export const ACTION_RESET_SKINS_BY_CHAMPION = createAction('skinsByChampion/reset');

export const ACTION_SET_CHROMA_TO_PARENT_SKIN = createAction<Record<number, number>>('chromaToParentSkin/set');
export const ACTION_RESET_CHROMA_TO_PARENT_SKIN = createAction('chromaToParentSkin/reset');

export const ACTION_SET_FRIENDS = createAction<Record<PUUID, Friend>>('friends/set');
export const ACTION_UPDATE_FRIEND_SINGLE = createAction<FriendUpdateData>('friend/update');
export const ACTION_RESET_FRIENDS = createAction('friends/reset');

export const ACTION_SET_FRIEND_GROUPS = createAction<Record<number, FriendGroup>>('friendGroups/set');
export const ACTION_UPDATE_FRIEND_GROUPS_SINGLE = createAction<FriendGroupUpdateData>('friendGroup/update');
export const ACTION_RESET_FRIEND_GROUPS = createAction('friendGroups/reset');

export const ACTION_SET_SELF_PRESENCE = createAction<PresenceState>('presence/set');
export const ACTION_RESET_SELF_PRESENCE = createAction('presence/reset');

export const ACTION_SET_PATCHER_STATE = createAction<PatcherState>('patcher/set');
export const ACTION_RESET_PATCHER_STATE = createAction('patcher/reset');

export const ACTION_SET_GAMEFLOW_STATE = createAction<GameflowState>('gameflowState/set');
export const ACTION_RESET_GAMEFLOW_STATE = createAction('gameflowState/reset');

export const ACTION_SET_INTERNAL_STATE = createAction<InternalState>('internalState/set');

export const ACTION_SET_LOBBY_STATE = createAction<LobbyState>('lobbyState/set');
export const ACTION_RESET_LOBBY_STATE = createAction('lobbyState/reset');

export const ACTION_SET_LOOT_STATE = createAction<LootState>('lootState/set');
export const ACTION_RESET_LOOT_STATE = createAction('lootState/reset');

export const ACTION_SET_INVITATIONS = createAction<Invitation[]>('invitations/set');
export const ACTION_RESET_INVITATIONS = createAction('invitations/reset');

export const ACTION_SET_TICKER_MESSAGES = createAction<TickerMessage[]>('tickerMessages/set');
export const ACTION_RESET_TICKER_MESSAGES = createAction('tickerMessages/reset');

export const ACTION_SET_HONOR_EOG_STATE = createAction<EOGHonorState>('honorEOG/set');
export const ACTION_RESET_HONOR_EOG_STATE = createAction('honorEOG/reset');

export const ACTION_SET_CURRENT_SUMMONER = createAction<CurrentSummonerState>('currentSummoner/set');
export const ACTION_RESET_CURRENT_SUMMONER = createAction('currentSummoner/reset');

export const ACTION_SET_MATCHMAKING_SEARCH_STATE = createAction<MatchmakingSearchState>('matchmakingSearchState/set');
export const ACTION_RESET_MATCHMAKING_SEARCH_STATE = createAction('matchmakingSearchState/reset');

export const ACTION_SET_CHAMP_SELECT_STATE = createAction<ChampSelectState>('champSelectState/set');
export const ACTION_RESET_CHAMP_SELECT_STATE = createAction('champSelectState/reset');

export const ACTION_SET_PRESENCE = createAction<PresenceState>('genericPresenceUpdate/set');
export const ACTION_UPDATE_PRESENCE_SINGLE = createAction<FriendUpdateData>('genericPresenceUpdate/update');
export const ACTION_RESET_PRESENCE = createAction('genericPresence/reset');

export const ACTION_SET_CHALLENGE_SUMMARY = createAction<ChallengeSummaryState>('challengeSummary/set');
export const ACTION_UPDATE_CHALLENGE_SUMMARY_SINGLE = createAction<ChallengeSummaryUpdateData>('challengeSummary/update');
export const ACTION_RESET_CHALLENGE_SUMMARY = createAction('challengeSummary/reset');

export const ACTION_SET_WINDOW_FOCUSED = createAction<WindowFocusState>('windowFocused/set');
export const ACTION_SET_ACTIVE_CONTAINER = createAction<ContainerState>('activeContainer/set');

export const ACTION_SET_ALL_DATA_LOADED = createAction<boolean>('allDataLoaded/set');

const mapAssetsReducer = createReducer(
    INITIAL_MAP_ASSETS_STATE,
    (builder) => {
        builder
            .addCase(
                ACTION_SET_MAP_ASSETS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const summonerSpellsReducer = createReducer(
    INITIAL_SUMMONER_SPELLS,
    (builder) => {
        builder
            .addCase(
                ACTION_SET_SUMMONER_SPELLS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_SUMMONER_SPELLS,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const regaliaStateReducer = createReducer(
    INITIAL_REGALIA_STATE,
    (builder) => {
        builder
            .addCase(
                ACTION_SET_REGALIA,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_SET_SINGLE_REGALIA,
                (state, action) => {
                    const newData = action.payload;
                    const newState = {...state};
                    newState[newData.id] = newData.data;
                    return newState;
                }
            )
            .addCase(
                ACTION_RESET_REGALIA,
                (state, action) => {
                    return null;
                }
            )
            .addDefaultCase((state, action) => {
            });
    }
);

const skinsReducer = createReducer(
    INITIAL_SKIN_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_SKINS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_SKINS,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const queueReducer = createReducer(
    INITIAL_QUEUES,
    builder => {
        builder
            .addCase(
                ACTION_SET_QUEUES,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_SET_SINGLE_QUEUE,
                (state, action) => {
                    const newData = action.payload;
                    const newState = {...state};
                    newState[newData.id] = newData.queue;
                    return newState;
                }
            )
            .addCase(
                ACTION_RESET_QUEUES,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const queueTypeToIdReducer = createReducer(
    INITIAL_QUEUES_TYPE_TO_ID,
    builder => {
        builder
            .addCase(
                ACTION_SET_QUEUES_TYPE_TO_ID,
                (state, action) => {
                    const newQueueMap = {} as Record<string, number>;
                    for (const key in action.payload) {
                        newQueueMap[action.payload[key].type] = action.payload[key].id;
                    }
                    return newQueueMap;
                }
            )
            .addCase(
                ACTION_SET_SINGLE_QUEUE_TYPE_TO_ID,
                (state, action) => {
                    const newData = action.payload as QueueUpdateData;
                    const newState = {...state};
                    newState[newData.queue.type] = newData.id;
                    return newState;
                }
            )
            .addCase(
                ACTION_RESET_QUEUES_TYPE_TO_ID,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const championReducer = createReducer(
    INITIAL_CHAMPION_STATE,
    (builder) => {
        builder
            .addCase(
                ACTION_SET_CHAMPIONS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_CHAMPIONS,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const challengeDataReducer = createReducer(
    INITIAL_CHALLENGE_DATA,
    builder => {
        builder
            .addCase(
                ACTION_SET_CHALLENGE_DATA,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_CHALLENGE_DATA,
                (state, action) => {
                    return null;
                }
            )
            .addDefaultCase((state, action) => {
                return state;
            });
    }
);

const ownedSkinsReducer = createReducer(
    INITIAL_SKIN_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_OWNED_SKINS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const ownedChampionsReducer = createReducer(
    INITIAL_OWNED_CHAMPIONS,
    builder => {
        builder
            .addCase(
                ACTION_SET_OWNED_CHAMPIONS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {

            });
    }
);

const presenceReducer = createReducer(
    INITIAL_PRESENCE_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_SELF_PRESENCE,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_SELF_PRESENCE,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const patcherReducer = createReducer(
    INITIAL_PATCHER_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_PATCHER_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const friendsReducer = createReducer(
    INITIAL_FRIENDS_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_FRIENDS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_UPDATE_FRIEND_SINGLE,
                (state, action) => {
                    const newState: Record<string, Friend> = {...state};
                    const friendData: FriendUpdateData = action.payload;
                    console.log(
                        'Updating friend: ',
                        friendData
                    );
                    const newFriend = friendData.data;
                    if (newFriend === null) {
                        delete newState[friendData.id];
                    } else {
                        newState[friendData.id] = friendData.data;
                    }
                    return newState;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const friendGroupReducer = createReducer(
    INITIAL_FRIEND_GROUP_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_FRIEND_GROUPS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_UPDATE_FRIEND_GROUPS_SINGLE,
                (state, action) => {
                    const newState: Record<number, FriendGroup> = {...state};
                    const updateData = action.payload;
                    newState[updateData.key] = updateData.group;
                    return newState;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const gameflowStateReducer = createReducer(
    INITIAL_GAMEFLOW_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_GAMEFLOW_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const lobbyStateReducer = createReducer(
    INITIAL_LOBBY_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_LOBBY_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const lootStateReducer = createReducer(
    INITIAL_LOOT_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_LOOT_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const invitationsReducer = createReducer(
    INITIAL_INVITATIONS,
    builder => {
        builder
            .addCase(
                ACTION_SET_INVITATIONS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const tickerMessagesReducer = createReducer(
    INITIAL_TICKER_MESSAGES,
    builder => {
        builder
            .addCase(
                ACTION_SET_TICKER_MESSAGES,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const internalStateReducer = createReducer(
    INITIAL_INTERNAL_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_INTERNAL_STATE,
                (state, action) => {
                    console.log(
                        'Setting internal state: ',
                        action.payload
                    );
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const currentSummonerReducer = createReducer(
    INITIAL_CURRENT_SUMMONER,
    builder => {
        builder
            .addCase(
                ACTION_SET_CURRENT_SUMMONER,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_CURRENT_SUMMONER,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const champSelectStateReducer = createReducer(
    INITIAL_CHAMP_SELECT_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_CHAMP_SELECT_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_CHAMP_SELECT_STATE,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const matchmakingSearchStateReducer = createReducer(
    INITIAL_MATCHMAKING_SEARCH_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_MATCHMAKING_SEARCH_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_MATCHMAKING_SEARCH_STATE,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const honorEOGReducer = createReducer(
    INITIAL_HONOR_EOG_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_HONOR_EOG_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_HONOR_EOG_STATE,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const skinsByChampionReducer = createReducer(
    INITIAL_SKINS_BY_CHAMPION,
    builder => {
        builder
            .addCase(
                ACTION_SET_SKINS_BY_CHAMPION,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_SKINS_BY_CHAMPION,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const chromaToParentSkinReducer = createReducer(
    INITIAL_CHROMA_TO_PARENT_SKIN,
    builder => {
        builder
            .addCase(
                ACTION_SET_CHROMA_TO_PARENT_SKIN,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_RESET_CHROMA_TO_PARENT_SKIN,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
                return undefined;
            });
    }
);

const genericPresenceReducer = createReducer(
    INITIAL_GENERIC_PRESENCE_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_PRESENCE,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_UPDATE_PRESENCE_SINGLE,
                (state, action) => {
                    const newState: Record<string, Friend> = {...state};
                    const newData = action.payload as FriendUpdateData;
                    console.log(
                        'Updating ' + newData?.id + ': ',
                        newData
                    );
                    newState[newData.id] = newData.friend;
                    return newState;
                }
            )
            .addCase(
                ACTION_RESET_PRESENCE,
                (state, action) => {
                    return null;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const challengeSummaryReducer = createReducer(
    INITIAL_CHALLENGE_SUMMARY_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_CHALLENGE_SUMMARY,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_UPDATE_CHALLENGE_SUMMARY_SINGLE,
                (state, action) => {
                    const newState = {...state};
                    const challenge = action.payload;
                    newState[challenge.puuid] = challenge.challengeSummary;
                    return newState;
                }
            )
            .addCase(
                ACTION_RESET_CHALLENGE_SUMMARY,
                (state, action) => {
                    return null;
                }
            )
            .addDefaultCase(
                (state, action) => {
                    return state;
                }
            );
    }
);

const windowFocusedReducer = createReducer(
    INITIAL_WINDOW_FOCUSED,
    builder => {
        builder
            .addCase(
                ACTION_SET_WINDOW_FOCUSED,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const activeContainerReducer = createReducer(
    INITIAL_ACTIVE_CONTAINER,
    builder => {
        builder
            .addCase(
                ACTION_SET_ACTIVE_CONTAINER,
                (state, action) => {
                    const container = action.payload;
                    return {container: container};
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const allDataLoadedReducer = createReducer(
    INITIAL_ALL_DATA_LOADED,
    builder => {
        builder
            .addCase(
                ACTION_SET_ALL_DATA_LOADED,
                (state, action) => {
                    return action.payload;
                }
            )
            .addDefaultCase((state, action) => {
                return state;
            });
    }
);


export const store = configureStore({
    reducer: {
        mapAssets: mapAssetsReducer,
        summonerSpells: summonerSpellsReducer,
        regalia: regaliaStateReducer,
        skins: skinsReducer,
        queues: queueReducer,
        queueTypeToId: queueTypeToIdReducer,
        champions: championReducer,
        challengeData: challengeDataReducer,

        ownedSkins: ownedSkinsReducer,
        ownedChampions: ownedChampionsReducer,

        skinsByChampion: skinsByChampionReducer,
        chromaToParentSkin: chromaToParentSkinReducer,

        friends: friendsReducer,
        friendGroups: friendGroupReducer,
        selfPresence: presenceReducer,
        patcherState: patcherReducer,
        lobbyState: lobbyStateReducer,
        lootState: lootStateReducer,
        invitations: invitationsReducer,
        tickerMessages: tickerMessagesReducer,
        internalState: internalStateReducer,
        gameflowState: gameflowStateReducer,
        currentSummoner: currentSummonerReducer,
        champSelectState: champSelectStateReducer,
        matchmakingSearchState: matchmakingSearchStateReducer,
        honorEOGState: honorEOGReducer,
        challengeSummary: challengeSummaryReducer,

        genericPresence: genericPresenceReducer,

        windowFocused: windowFocusedReducer,
        allDataLoaded: allDataLoadedReducer,
        activeContainer: activeContainerReducer
    }
});