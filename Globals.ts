import {Color} from './types/Color';
import {
    Friend,
    LootItem,
    MapAssetAssets,
    MapAssets,
    RemoteMapAsset,
    RemoteMapAssets,
    SocialAvailability
} from './types/Store';

const VERSION_MAJOR: number = 0;
const VERSION_MINOR: number = 1;
const VERSION_PATCH: number = 8;

export const APPLICATION_NAME: string = 'Poro-Client';

export const VERSION: string = `${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;

export const APPLICATION_PORT: number = 35199;

export const VERSION_SHORT: string = `v${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const VERSION_LONG: string = `Version ${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const BROWSER_TITLE: string = `${APPLICATION_NAME} ${VERSION_SHORT}`;

//================================ URL PATHS ================================
const BASE_URL: string = `http://127.0.0.1:${APPLICATION_PORT}`;

export const PROXY_PREFIX: string = BASE_URL + '/proxy';
export const PROXY_STATIC_PREFIX: string = PROXY_PREFIX + '/static';
export const STATIC_PREFIX: string = BASE_URL + '/static';
export const REST_PREFIX: string = BASE_URL + '/rest';
export const REST_V1_PREFIX: string = BASE_URL + '/rest/v1';

export const WEBSOCKET_URL: string = `ws://127.0.0.1:${APPLICATION_PORT}/ws/`;

export const GITHUB_ISSUES_URL: string = 'https://github.com/IAmBadAtPlaying/poro-client/issues';

//=================================== REST URL ===================================
export const FETCH_BACKEND_STATUS_URL: string = REST_V1_PREFIX + '/status';
export const POST_SEARCH_LEAGUE_PROCESS_URL: string = REST_V1_PREFIX + '/status/findProcess';

//=================================== FETCH STATIC SHARED URL ===================================
export const FETCH_SKINS_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/skins.json';
export const FETCH_QUEUES_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/queues.json';
export const FETCH_WARD_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/ward-skins.json';
export const FETCH_ICONS_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/summoner-icons.json';
export const FETCH_EMOTES_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/summoner-emotes.json';
export const FETCH_REGALIA_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/regalia.json';
export const FETCH_SUMMONER_SPELLS_URL: string = PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/summoner-spells.json';

//=================================== FETCH DYNAMIC SHARED URL ===================================

export const FETCH_CLIENT_SYSTEM_STATES_URL: string = PROXY_PREFIX + '/lol-platform-config/v1/namespaces/ClientSystemStates';
export const FETCH_OWNED_CHAMPIONS_MINIMAL_URL: string = PROXY_PREFIX + '/lol-champions/v1/owned-champions-minimal';
export const FETCH_SKIN_INVENTORY_URL: string = PROXY_PREFIX + '/lol-inventory/v2/inventory/CHAMPION_SKIN';


//=================================== URLS FROM PARAMETERS ===================================
export function getChampionIconURL(championId: number): string {
    if (championId <= 0) {
        championId = -1;
    }
    return PROXY_PREFIX + `/lol-game-data/assets/v1/champion-icons/${championId}.png`;
}

//================================= HARDCODED VALUES ===================================

export const CHAMP_SELECT_MAX_BANS_PER_TEAM = 5;
export const CHAMP_SELECT_MAX_MEMBERS_PER_TEAM = 5;

//================================= ENUMS ===================================
export const BACKGROUND_TYPE_IMAGE = 'LOCAL_IMAGE';
export const BACKGROUND_TYPE_VIDEO = 'LOCAL_VIDEO';
export const BACKGROUND_TYPE_LCU_IMAGE = 'LCU_IMAGE';
export const BACKGROUND_TYPE_LCU_VIDEO = 'LCU_VIDEO';
export const BACKGROUND_TYPE_NONE = 'NONE';

export const BACKEND_STATE_STARTING = 'STARTING';
export const BACKEND_STATE_AWAITING_LEAGUE_PROCESS = 'AWAITING_LEAGUE_PROCESS';
export const BACKEND_STATE_NO_PROCESS_IDLE = 'NO_PROCESS_IDLE';
export const BACKEND_STATE_AWAITING_LCU_CONNECTION = 'AWAITING_LCU_CONNECTION';
export const BACKEND_STATE_AWAITING_LCU_INIT = 'AWAITING_LCU_INIT';
export const BACKEND_STATE_CONNECTED = 'CONNECTED';
export const BACKEND_STATE_DISCONNECTED = 'DISCONNECTED';
export const BACKEND_STATE_STOPPING = 'STOPPING';

export const GAMEFLOW_NONE = 'None';
export const GAMEFLOW_TERMINATED_IN_ERROR = 'TerminatedInError';
export const GAMEFLOW_LOBBY = 'Lobby';
export const GAMEFLOW_READY_CHECK = 'ReadyCheck';
export const GAMEFLOW_CHAMP_SELECT = 'ChampSelect';
export const GAMEFLOW_GAME_START = 'GameStart';
export const GAMEFLOW_IN_PROGRESS = 'InProgress';
export const GAMEFLOW_RECONNECT = 'Reconnect';
export const GAMEFLOW_MATCHMAKING = 'Matchmaking';
export const GAMEFLOW_WAITING_FOR_STATS = 'WaitingForStats';
export const GAMEFLOW_END_OF_GAME = 'EndOfGame';
export const GAMEFLOW_PRE_END_OF_GAME = 'PreEndOfGame';
export const GAMEFLOW_CHECKED_INTO_TOURNAMENT = 'CheckedIntoTournament';

export const KNOWN_GAME_MODES = {
    TFT: 'TFT',
    ARAM: 'ARAM',
    CLASSIC: 'CLASSIC',
    ARENA: 'CHERRY',
    PRACTICETOOL: 'PRACTICETOOL'
};

export const LOOT_TYPES = {
    SKIN_RENTAL: 'SKIN_RENTAL',
    CHAMPION_RENTAL: 'CHAMPION_RENTAL',
    SUMMONER_ICON: 'SUMMONERICON',
    CURRENCY: 'CURRENCY',
    MATERIAL: 'MATERIAL'
};

export const LOBBY_POSITIONS = {
    TOP: 'TOP',
    JUNGLE: 'JUNGLE',
    MIDDLE: 'MIDDLE',
    BOTTOM: 'BOTTOM',
    SUPPORT: 'UTILITY',
    FILL: 'FILL',
    UNSELECTED: 'UNSELECTED'
};

const GAME_STATUS_TO_STRING_MAP: Record<string, string> = {
    inGame: 'In Game',
    championSelect: 'Champ Select',
    outOfGame: 'Online',
    inQueue: 'Searching for Game'
};

const GAMEMODE_TO_STRING: Record<string, string> = {
    ARAM_UNRANKED_5x5: 'ARAM',
    NORMAL: 'Normal',
    Custom: 'Custom',
    PRACTICETOOL: 'Practice Tool',
    RIOTSCRIPT_BOT: 'Co-Op vs AI',
    RANKED_SOLO_5x5: 'Ranked Solo',
    RANKED_FLEX_SR: 'Ranked Flex',
    NORMAL_TFT: 'TFT Normal',
    RANKED_TFT: 'TFT Ranked',
    RANKED_TFT_DOUBLE_UP: 'TFT Ranked Double Up',
    RANKED_TFT_TURBO: 'TFT Ranked Hyper Roll',
    CHERRY: 'Arena'
};

const LOOT_TYPE_TO_STRING: Record<string, string> = {
    CHAMPION_RENTAL: 'Champion Shard',
    SKIN_RENTAL: 'Skin Shard',
    CHAMPION: 'Champion Permanent',
    SKIN: 'Skin Permanent',
    WARDSKIN_RENTAL: 'Ward Skin Shard',
    WARDSKIN: 'Ward Skin Permanent',
    EMOTE: 'Emote',
    SUMMONER_ICON: 'Summoner Icon',
    CURRENCY: 'Currency',
    MATERIAL: 'Material'
};

const SPECIAL_MAP_IDS: Record<number, string> = {};

const HOSTING_PREFIX = 'hosting_';

const GAME_STATUS_TO_STRING = (remoteActivity: string): string => {
    if (remoteActivity.startsWith(HOSTING_PREFIX)) {
        const sliced = remoteActivity.slice(HOSTING_PREFIX.length);
        const gameMode = GAMEMODE_TO_STRING[sliced] ?? sliced;
        return `Creating ${gameMode} Game`;
    } else {
        return GAME_STATUS_TO_STRING_MAP[remoteActivity] ?? remoteActivity;
    }
};
export const AVAILABILITY_ORDER = [SocialAvailability.CHAT, SocialAvailability.DND, SocialAvailability.ONLINE, SocialAvailability.AWAY, SocialAvailability.MOBILE, SocialAvailability.OFFLINE, SocialAvailability.UNKNOWN];

//================================= UTIL FUNCTIONS ===================================
export const applyMultipleStyles = (baseStyle: string, ...styles: string[]): string => {
    return styles.reduce(
        (acc, style) => acc + ' ' + style,
        baseStyle
    );
};

export const getMapInfo = (mapAssets: MapAssets | Record<string, never>, mapId: number | undefined, gameMode: string | undefined): RemoteMapAsset | undefined => {
    if (mapId === undefined || gameMode === undefined) {
        return undefined;
    }
    if (mapAssets[mapId] === undefined) {
        return undefined;
    }
    return mapAssets[mapId][gameMode];
};

export const getMapAsset = (mapAssets: MapAssets | Record<string, never>, mapId: number | undefined, gameMode: string | undefined): MapAssetAssets | undefined => {
    if (mapId === undefined || gameMode === undefined) {
        return undefined;
    }
    if (mapAssets[mapId] === undefined) {
        return undefined;
    }
    return mapAssets[mapId][gameMode].assets;
};

export const getSpecificMapAsset = (mapAssets: MapAssets | Record<string, never>, mapId: number | undefined, gameMode: string | undefined, asset: string): string | undefined => {
    const mapAsset = getMapAsset(
        mapAssets,
        mapId,
        gameMode
    );
    if (mapAsset === undefined) {
        return undefined;
    }
    return mapAsset[asset];
};

const getGameSelectIconOverride = (mapId: number, gameMode: string): string | undefined => {
    switch (mapId) {
        case 22: //TFT
            return STATIC_PREFIX + '/assets/png/lobbies/tft/game-select-icon-active.png';
        case 11: //SR
            switch (gameMode) {
                case 'TUTORIAL_MODULE_1':
                case 'TUTORIAL_MODULE_2':
                case 'TUTORIAL_MODULE_3':
                    return STATIC_PREFIX + '/assets/png/lobbies/tutorial/tutorial-active.png';
                case 'PRACTICETOOL':
                    return STATIC_PREFIX + '/assets/png/lobbies/practicetool/practicetool-active.png';
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return undefined;
};

export const getGameSelectIconActive = (mapAssets: MapAssets | Record<string, never>, mapId: number | undefined, gameMode: string | undefined): string => {
    const overridePath = getGameSelectIconOverride(
        mapId,
        gameMode
    );

    if (overridePath !== undefined) {
        return overridePath;
    }

    const pathPart = getSpecificMapAsset(
        mapAssets,
        mapId,
        gameMode,
        'game-select-icon-active'
    );

    if (pathPart !== undefined) {
        return PROXY_STATIC_PREFIX + '/' + pathPart;
    }

    return '';
};


const getGameSelectIconOverrideVideo = (mapId: number, gameMode: string): string | undefined => {
    switch (mapId) {
        case 22: //TFT
            return STATIC_PREFIX + '/assets/webm/lobbies/tft/game-select-icon-active.webm';
        case 11: //SR
            switch (gameMode) {
                case 'TUTORIAL_MODULE_1':
                case 'TUTORIAL_MODULE_2':
                case 'TUTORIAL_MODULE_3':
                    return STATIC_PREFIX + '/assets/webm/lobbies/tutorial/tutorial-active-video.webm';
                case 'PRACTICETOOL':
                    return STATIC_PREFIX + '/assets/webm/lobbies/practicetool/practicetool-active-video.webm';
            }
            break;
        default:
            break;
    }
    return undefined;
};

export const getGameSelectVideoActive = (mapAssets: MapAssets | Record<string, never>, mapId: number | undefined, gameMode: string | undefined): string => {
    const overridePath = getGameSelectIconOverrideVideo(
        mapId,
        gameMode
    );

    if (overridePath !== undefined) {
        return overridePath;
    }

    const pathPart = getSpecificMapAsset(
        mapAssets,
        mapId,
        gameMode,
        'game-select-icon-active-video'
    );

    if (pathPart !== undefined) {
        return PROXY_STATIC_PREFIX + '/' + pathPart;
    }

    return '';
};

const getGameSelectIconDefaultOverride = (gamemode: string, mapId: number): string | undefined => {
    switch (mapId) {
        case 22: //TFT
            return STATIC_PREFIX + '/assets/png/lobbies/tft/game-select-icon-default.png';
        case 11: //SR
            switch (gamemode) {
                case 'TUTORIAL_MODULE_1':
                case 'TUTORIAL_MODULE_2':
                case 'TUTORIAL_MODULE_3':
                    return STATIC_PREFIX + '/assets/png/lobbies/tutorial/tutorial-default.png';
                case 'PRACTICETOOL':
                    return STATIC_PREFIX + '/assets/png/lobbies/practicetool/practicetool-default.png';
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return undefined;
};

export const getGameSelectDefault = (mapAssets: MapAssets | Record<string, never>, mapId: number | undefined, gameMode: string | undefined): string => {
    const overridePath = getGameSelectIconDefaultOverride(
        gameMode,
        mapId
    );

    if (overridePath !== undefined) {
        return overridePath;
    }

    const pathPart = getSpecificMapAsset(
        mapAssets,
        mapId,
        gameMode,
        'game-select-icon-default'
    );

    if (pathPart !== undefined) {
        return PROXY_STATIC_PREFIX + '/' + pathPart;
    }

    return '';
};

export const isEmptyObject = (obj: Record<never, unknown>): boolean => {
    return Object.keys(obj).length === 0;
};

//================================= TRANSFORM FUNCTIONS ===================================

export const getPrettyCount = (count: number): string => {
    if (count < 1000) {
        return count.toString();
    }
    if (count < 1000000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return (count / 1000000).toFixed(1) + 'm';
};

export const getTilePathUrl = (item: LootItem) => {
    const tilePath = item.tilePath;
    const itemId = item.lootId;
    switch (itemId) {
        case 'CURRENCY_champion':
            return STATIC_PREFIX + '/assets/png/currencies/big/blue_essence.png';
        case 'CURRENCY_cosmetic':
            return STATIC_PREFIX + '/assets/png/currencies/big/orange_essence.png';
        case 'MATERIAL_key':
            return STATIC_PREFIX + '/assets/png/currencies/big/key.png';
        default:
            return PROXY_STATIC_PREFIX + tilePath;
    }
};

export const getReadableLootName = (lootItem: LootItem): string => {
    const lootId = lootItem.lootId;
    switch (lootId) {
        case 'CURRENCY_champion':
            return 'Blue Essence';
        case 'CURRENCY_cosmetic':
            return 'Orange Essence';
        case 'chest_generic':
            return 'Hextech Chest';
        case 'MATERIAL_key':
            return 'Hextech Key';
        default:
            return lootItem.itemDesc ?? lootId;
    }
};

export const getReadableLootCategoryName = (lootType: string | undefined): string => {
    if (lootType === undefined) {
        return 'Unknown';
    }

    return LOOT_TYPE_TO_STRING[lootType] ?? lootType;
};

export const getActivityFromRemoteActivity = (remoteActivity: string | undefined, alternative: string): string => {
    if (remoteActivity === undefined) {
        return 'In Game - ' + alternative;
    }
    return GAME_STATUS_TO_STRING(remoteActivity);
};

export const getActivityFromCombinedActivity = (availability: string, remoteActivity: string | undefined, alternative: string): string => {
    switch (availability) {
        case 'online':
        case 'chat':
            return 'Online';
        case 'dnd':
            return getActivityFromRemoteActivity(
                remoteActivity,
                alternative
            );
        case 'away':
            return 'AFK';
        case 'mobile':
            return 'Riot Mobile';
        case 'offline':
        default:
            return 'Offline';
    }
};

export const getMapAssetsFromRemoteMapAssets = (remoteMapAssets: RemoteMapAssets): MapAssets => {
    const intermediateObject = {} as MapAssets;
    Object.keys(remoteMapAssets).forEach((key) => {
        if (intermediateObject[key] !== undefined) {
            return;
        }
        const asset = remoteMapAssets[key];
        const assetsByGameMode: Record<string, RemoteMapAsset> = {};
        if (asset.length === 0) {
            return;
        }
        for (const element of asset) {
            assetsByGameMode[element.gameMode] = element;
        }
        intermediateObject[key] = assetsByGameMode;
    });

    return intermediateObject;
};

//================================= UPDATE-EVENTS ===================================

const getInitialUpdateString = (update: string): string => {
    return `Initial${update}`;
};

export const UPDATES = {
    INTERNAL_STATE_UPDATE: 'INTERNAL_STATE',
    INITIAL_UPDATES_DONE_UPDATE: 'ALL_INITIAL_DATA_LOADED',

    LOBBY_STATE_UPDATE: 'STATE_LOBBY',
    GAMEFLOW_PHASE_UPDATE: 'STATE_GAMEFLOW_PHASE',
    CHAMPION_SELECT_UPDATE: 'STATE_CHAMP_SELECT',
    PATCHER_STATE_UPDATE: 'STATE_PATCHER',
    SELF_PRESENCE_STATE_UPDATE: 'STATE_SELF_PRESENCE',
    HONOR_EOG_UPDATE: 'STATE_HONOR_EOG',
    LOOT_UPDATE: 'STATE_LOOT',
    CURRENT_SUMMONER_UPDATE: 'STATE_CURRENT_SUMMONER',
    MATCHMAKING_SEARCH_STATE_UPDATE: 'STATE_MATCHMAKING_SEARCH',


    FRIEND_UPDATE: 'SINGLE_FRIEND',
    INITIAL_FRIEND_LIST_UPDATE: 'MAP_FRIENDS',

    FRIEND_GROUP_UPDATE: 'SINGLE_FRIEND_GROUP',
    INITIAL_FRIEND_GROUP_UPDATE: 'MAP_FRIEND_GROUPS',

    QUEUE_UPDATE: 'MAP_QUEUES',
    SINGLE_QUEUE_UPDATE: 'SINGLE_QUEUE',

    GENERIC_PRESENCE_UPDATE: 'SINGLE_GENERIC_PRESENCE',
    INITIAL_GENERIC_PRESENCE_UPDATE: 'MAP_GENERIC_PRESENCES',

    FRIEND_HOVERCARD_UPDATE: 'SINGLE_FRIEND_HOVERCARD',
    INITIAL_FRIEND_HOVERCARD_UPDATE: 'MAP_FRIEND_HOVERCARDS',

    CHALLENGE_SUMMARY_UPDATE: 'SINGLE_CHALLENGE_SUMMARY',
    INITIAL_CHALLENGE_SUMMARY_UPDATE: 'MAP_CHALLENGE_SUMMARY',

    REGALIA_UPDATE: 'MAP_REGALIA',
    SINGLE_REGALIA_UPDATE: 'SINGLE_REGALIA',

    TICKER_MESSAGE_ARRAY_UPDATE: 'ARRAY_TICKER_MESSAGES',
    OWNED_SKINS_UPDATE: 'ARRAY_OWNED_SKINS',
    OWNED_CHAMPIONS_UPDATE: 'ARRAY_OWNED_CHAMPIONS',
    INVITATIONS_ARRAY_UPDATE: 'ARRAY_INVITATIONS'
};

//================================= COLORS ===================================
// Taken from https://brand.riotgames.com/de-de/league-of-legends/color

export const BrandColor = {
    BLUE1: Color.fromHex('#CDFAFA'),
    BLUE2: Color.fromHex('#0AC889'),
    BLUE3: Color.fromHex('#0397AB'),
    BLUE4: Color.fromHex('#005A82'),
    BLUE5: Color.fromHex('#0A323C'),
    BLUE6: Color.fromHex('#091428'),
    BLUE7: Color.fromHex('#0A1428'),

    GOLD1: Color.fromHex('#F0E6D2'),
    GOLD2: Color.fromHex('#C8AA6E'),
    GOLD3: Color.fromHex('#C8AA6E'),
    GOLD4: Color.fromHex('#C89B3C'),
    GOLD5: Color.fromHex('#785A28'),
    GOLD6: Color.fromHex('#463714'),
    GOLD7: Color.fromHex('#32281E'),

    GREY1: Color.fromHex('#A09B8C'),
    GREY1DOT5: Color.fromHex('#5B5A56'),
    GREY2: Color.fromHex('#3C3C41'),
    GREY3: Color.fromHex('#1E2328'),
    GREY_COOL: Color.fromHex('#1E282D'),

    HEXTECH_BLACK: Color.fromHex('#010A13')
};
