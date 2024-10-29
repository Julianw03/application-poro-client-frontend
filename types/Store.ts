import * as Globals from '../Globals';

//======================== Generic Utility Types ========================
export type PUUID = string; //PUUID is in the UUID format
export type SUMMONER_ID = number; //In theory this is deprecated, but it's still used in many places
export type ID = string; //ID is the PUUID plus region identifier (puuid@eu1.pvp.net)

export type ContentId = string; //UUID
export type ItemId = number; //Item ID

//======================== SYSTEM CLIENT STATES ========================
export interface SystemClientState {
    advancedTutorialCompleted: boolean,
    archivedStatsEnabled: boolean,
    buddyNotesEnabled: boolean,
    championTradeThroughLCDS: boolean,
    clientHeartBeatRateSeconds: number,
    currentSeason: number,
    displayPromoGamesPlayedEnabled: boolean,
    enabledQueueIdsList: number[],
    freeToPlayChampionForNewPlayersIdList: number[],
    freeToPlayChampionIdList: number[],
    freeToPlayChampionsForNewPlayersMaxLevel: number,
    gameMapEnabledDTOList: object[],
    gameModeToInactiveSpellIds: object,
    inactiveAramSpellIdList: number[],
    inactiveChampionIdList: number[],
    inactiveClassicSpellIdList: number[],
    inactiveOdinSpellIdList: number[],
    inactiveSpellIdList: number[],
    inactiveTutorialSpellIdList: number[],
    knownGeographicGameServerRegions: string[],
    leagueServiceEnabled: boolean,
    leaguesDecayMessagingEnabled: boolean,
    localeSpecificChatRoomsEnabled: boolean,
    masteryPageOnServer: boolean,
    maxMasteryPagesOnServer: number,
    minNumPlayersForPracticeGame: number,
    modularGameModeEnabled: boolean,
    observableCustomGameModes: string,
    observableGameModes: string[],
    observerModeEnabled: boolean,
    practiceGameEnabled: boolean,
    practiceGameTypeConfigIdList: number[],
    queueThrottleDTO: object,
    replayServiceAddress: string,
    replaySystemStates: object,
    riotDataServiceDataSendProbability: number,
    runeUniquePerSpellBook: boolean,
    sendFeedbackEventsEnabled: boolean,
    spectatorSlotLimit: number,
    storeCustomerEnabled: boolean,
    teamServiceEnabled: boolean,
    tournamentSendStatsEnabled: boolean,
    tournamentShortCodesEnabled: boolean,
    tribunalEnabled: boolean,
    unobtainableChampionSkinIDList: number[]
}

//======================== INTERNAL STATES ========================
export interface InternalState {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    state: Globals.BACKEND_STATE_STARTING | Globals.BACKEND_STATE_AWAITING_LEAGUE_PROCESS | Globals.BACKEND_STATE_NO_PROCESS_IDLE | Globals.BACKEND_STATE_AWAITING_LCU_CONNECTION | Globals.BACKEND_STATE_CONNECTED | Globals.BACKEND_STATE_DISCONNECTED | Globals.BACKEND_STATE_STOPPING;
}

//======================== FRIENDS ========================

export interface FriendGroup {
    collapsed: boolean,
    id: number,
    isLocalized: boolean,
    isMetaGroup: boolean,
    name: string,
    priority: number
}


export interface LolPresence {
    bannerIdSelected?: string,
    challengeCrystalLevel?: string,
    challengePoints?: number,
    challengeTokensSelected?: string, //In this wonderful form "ID_1,ID_2,ID_3", I surely love league of legends
    championId: number,
    companionId: string,
    damageSkinId: number,
    gameId?: number,
    gameMode?: string,
    gameQueueType: string,
    gameStatus: string,
    iconOverride: IconOverride,
    isObservable: Observablility,
    legendaryMasteryScore?: string,
    level: string,
    mapId: string,
    mapSkinId: string,
    masteryScore?: string,
    playerTitleSelected?: string
    profileIcon: string,
    pty?: {
        maxPlayers: number,
        partyId: string,
        queueId: number,
        summoners: SUMMONER_ID[]
    }
    puuid: PUUID,
    queueId: string
    rankedLeagueDivision: string,
    rankedLeagueTier: string,
    rankedLosses: string,
    rankedPrevSeasonDivision: string,
    rankedPrevSeasonTier: string,
    rankedSplitRewardLevel: string,
    rankedWins: string,
    regalia: UserRegalia,
    skinVariant: string,
    skinname: string,
    timeStamp?: string,
}

export enum IconOverride {
    SUMMONER_ICON = 'summonerIcon',
    COMPANION_ICON = 'companion',
}

export enum Observablility {
    ALL = 'ALL',
    DROPINONLY = 'DROPINONLY',
    NONE = 'NONE',
    LOBBYONLY = 'LOBBYONLY',
}

export enum SocialAvailability {
    CHAT = 'chat',
    DND = 'dnd',
    ONLINE = 'online',
    AWAY = 'away',
    MOBILE = 'mobile',
    OFFLINE = 'offline',
    UNKNOWN = ''
}

export interface Friend {
    availability: SocialAvailability,
    displayGroupId: number,
    displayGroupName: string,
    gameName: string,
    gameTag: string,
    groupId: number,
    groupName: string,
    iconId: number,
    id: string,
    isP2PConversationMuted: boolean,
    lastSeenOnlineTimestamp: any,
    lol: LolPresence | Record<string, never>,
    name: string,
    note: string,
    patchline: string,
    pid: string,
    platformId: string,
    product: string,
    productName: string,
    puuid: PUUID,
    statusMessage: string,
    summary: string,
    summonerId: number
}

//======================== QUEUE ========================
export interface GameTypeConfig {
    advancedLearningQuests: boolean,
    allowTrades: boolean,
    banMode: string,
    banTimerDuration: number,
    battleBoost: boolean,
    crossTeamChampionPool: boolean,
    deathMatch: boolean,
    doNotRemove: boolean,
    duplicatePick: boolean,
    exclusivePick: boolean,
    gameModeOverride: any,
    id: number,
    learningQuests: boolean,
    mainPickTimerDuration: number,
    maxAllowableBans: number,
    name: string,
    numPlayersPerTeamOverride: any,
    onboardCoopBeginner: boolean,
    pickMode: string,
    postPickTimerDuration: number,
    reroll: boolean,
    teamChampionPool: boolean
}

export interface QueueRewards {
    isChampionPointsEnabled: boolean,
    isIpEnabled: boolean,
    isXpEnabled: boolean,
    partySizeIpRewards: [],
}

export enum QueueAvailability {
    AVAILABLE = 'Available',
    PLATFORM_DISABLED = 'PlatformDisabled'
}

export interface Queue {
    allowablePremadeSizes: number[],
    areFreeChampionsAllowed: boolean,
    assetMutator: string,
    category: string,
    championsRequiredToPlay: number,
    description: string,
    detailedDescription: string,
    gameMode: string,
    gameTypeConfig: GameTypeConfig
    id: number,
    isRanked: boolean,
    isTeamBuilderManaged: boolean,
    isVisible: boolean,
    lastToggledOffTime: number,
    lastToggledOnTime: number,
    mapId: number,
    maxDivisionForPremadeSize2: string,
    maxTierForPremadeSize2: string,
    maximumParticipantListSize: number,
    minLevel: number,
    minimumParticipantListSize: number,
    name: string,
    numPlayersPerTeam: number,
    queueAvailability: QueueAvailability,
    queueRewards: QueueRewards,
    removalFromGameAllowed: boolean,
    removalFromGameDelayMinutes: number,
    shortName: string,
    showPositionSelector: boolean,
    showQuickPlaySlotSelection: boolean,
    spectatorEnabled: boolean,
    type: string
}

//==================== Generic Presence ===================

export interface GenericPresence {
    availability: SocialAvailability,
    gameName: string,
    gameTag: string,
    icon: number,
    id: ID,
    lol: LolPresence,
    name: string,
    pid: string,
    puuid: PUUID,
    statusMessage: string,
    summonerId: number,
}

export interface GenericPresenceState extends Record<ID, GenericPresence> {}

export interface GenericPresenceUpdate {
    id: PUUID,
    data: GenericPresence
}

//======================== REGALIA ========================

export interface RegaliaJsonData extends Record<string, BaseRegalia> {}

export interface BaseRegalia {
    id: string
    secondaryMap: Record<string, Regalia>;
    default?: Regalia;
}

export interface Regalia {
    id: string,
    idSecondary: string,
    assetPath: string,
    isSelectable: boolean,
    regaliaType: string,
    localizedName: string,
    localizedDescription: string
}

//User Regalia
export interface UserRegaliaMap extends Record<PUUID, UserRegalia> {}

export interface UserRegaliaUpdate {
    id: PUUID,
    data: UserRegalia
}

export interface UserRegalia {
    bannerType: string,
    crestType: string,
    profileIconId: number,
    highestRankedEntry?: {
        division: string,
        queueType: string,
        splitRewardLevel: number,
        tier: string
    }
    selectedPrestigeCrest: number
    summonerLevel: number
}

//======================== SUMMONER SPELLS ========================

export interface SummonerSpell {
    id: number,
    name: string,
    description: string,
    summonerLevel: number,
    cooldown: number,
    gameModes: string[],
    iconPath: string,
}

export interface SummonerSpellState {
    [key: number]: SummonerSpell;
}

//======================== CHAMPIONS ========================

export interface MinimalChampion {
    id: number,
    alias: string,
    name: string,
    roles: string[],
}

export interface ChampionState {
    [key: string]: MinimalChampion;
}

export interface OwnedChampion {
    expirationDate: string,
    f2p: boolean,
    inventoryType: 'CHAMPION',
    itemId: number,
    loyalty: boolean,
    loyaltySources: string[],
    owned: boolean,
    ownershipType: string,
    payload: object;
    purchaseDate: string,
    quantity: number,
    rental: boolean,
    uuid: string,
    wins: number,
}

export interface OwnedChampionState {
    [key: number]: OwnedChampion;
}

//======================== HONOR EOG ========================
export interface EOGHonorPlayer {
    championName: string,
    skinSplashPath: string,
    summonerName: string,
    puuid: PUUID,
    summonerId: number,
    gameName: string,
}

export interface EOGHonorState {
    gameId: number,
    eligibleAllies: EOGHonorPlayer[],
    eligibleOpponents?: EOGHonorPlayer[],
}

//============================================================
//======================== WS-UPDATES ========================
//============================================================

export interface AbstractUpdateMessage {
    event: string,
    data: object | object[] | null,
}

export interface InternalStateUpdate extends AbstractUpdateMessage {
    event: string,
    data: {
        state: string,
    } | Record<string, never>
}

export interface PatcherUpdate extends AbstractUpdateMessage {
    event: string,
    data: {
        patcher: object,
    } | Record<string, never>
}

export interface HonorEndOfGameUpdate extends AbstractUpdateMessage {
    event: string,
    data: {
        honor: object,
    } | Record<string, never>
}

//======================== PATCHER ========================

export interface PatcherComponent {
    action: string,
    id: string,
    isCorrupted: boolean,
    isUpToDate: boolean,
    isUpdateAvailable: boolean,
    progess: any,
    timeOfLastUpToDateCheckISO8601: string
}

export interface PatcherState {
    action: string,
    components: PatcherComponent[],
    id: string,
    isCorrupted: boolean,
    isStopped: boolean,
    isUpToDate: boolean,
    isUpdateAvailable: boolean,
    percentPatched: number,
}

//======================== PRESENCE ========================
export interface PresenceState {
    availability: string,
    gameName: string,
    gameTag: string,
    icon: number,
    id: string,
    lol: LolPresence,
    name: string,
    pid: string,
    puuid: PUUID,
    regalia: object,
    statusMessage: string,
    summonerId: number,
}

//======================== INVITATIONS ========================

export interface GameConfig {
    gameMode: string,
    inviteGameType: string,
    mapId: number,
    queueId: number
}

export interface Invitation {
    canAcceptInvitation: boolean,
    fromSummonerName: string,
    fromGameName?: string,
    fromTagLine?: string,
    gameConfig: GameConfig,
    invitationId: string,
    invitationType: string,
    state: string
}

//======================== TICKER MESSAGES ========================

export interface TickerMessage {
    createdAt: string,
    heading: string,
    message: string,
    severity: string,
    updatedAt: string
}

//======================== LOBBY ========================

export interface LobbyInvitation {
    invitationId: string,
    invitationType: string,
    state: string,
    timestamp: string,
    toSummonerId: number,
    toSummonerName: string
}

export interface LobbyConfig {
    allowablePremadeSizes: number[],
    customTeam100: object[],
    customTeam200: object[],
    gameMode: string,
    isCustom: boolean,
    mapId: number,
    maxLobbySize: number,
    queueId: number,
    showPositionSelector: boolean
}

export interface QuickplaySlot {
    championId: number,
    perks: string;
    positionPreference: string,
    skinId: number,
    spell1: number,
    spell2: number
}

export interface LobbyMember {
    allowedChangeActivity: boolean,
    allowedInviteOthers: boolean,
    allowedKickOthers: boolean,
    allowedStartActivity: boolean,
    allowedToggleInvite: boolean,
    autoFillEligible: boolean,
    autoFillProtectedForPromos: boolean,
    autoFillProtectedForRemedy: boolean,
    autoFillProtectedForSoloing: boolean,
    autoFillProtectedForStreaking: boolean,
    botChampionId: number,
    botDifficulty: string,
    botId: string,
    firstPositionPreference: string,
    gameName: string,
    gameTag: string,
    intraSubteamPosition: null | any,
    isBot: boolean,
    isLeader: boolean,
    isSpectator: boolean,
    playerSlots: QuickplaySlot[],
    puuid: PUUID,
    quickplayPlayerState: null | any,
    ready: boolean,
    secondPositionPreference: string,
    showGhostedBanner: boolean,
    subteamIndex: number,
    summonerIconId: number,
    summonerId: number,
    summonerInternalName: string,
    summonerLevel: number,
    summonerName: string,
    teamId: number,
    tftNPEQueueBypass: boolean
}

export interface LobbyState {
    gameConfig?: LobbyConfig,
    partyId?: string,
    members: (LobbyMember | Record<string, never>)[],
    invitations: LobbyInvitation[],
    localMember: LobbyMember
}

//======================== LOOT ========================

export interface LootItem {
    assets: string,
    count: number,
    disenchantLootName: string,
    disenchantRecipeName: string,
    disenchantValue: number,
    displayCategories: string,
    expiryTime: number,
    isNew: boolean,
    isRental: boolean,
    itemDesc: string,
    itemStatus: string,
    localizedDescription: string,
    localizedName: string,
    localizedRecipeSubtitle: string,
    localizedRecipeTitle: string,
    lootId: string,
    lootName: string,
    parentItemStatus: string,
    parentStoreItemId: number,
    rarity: string,
    redeemableStatus: string,
    refId: string,
    rentalGames: number,
    rentalSeconds: number,
    shadowPath: string,
    splashPath: string,
    storeItemId: number,
    tags: string,
    tilePath: string,
    type: string,
    upgradeEssenceName: string,
    upgradeEssenceValue: number,
    upgradeLootName: string,
    value: number
}

export interface LootState {
    [key: string]: LootItem;
}


//======================== GAMEFLOW ========================

export interface GameflowState {
    gameDodge: object,
    phase: string,
}

//======================== MAP ASSETS ========================

export interface RemoteMapAssetProperties {
    suppressRunesMasteriesPerks: boolean;
}

export interface MapAssetAssets extends Partial<Record<string, string>> {
    'champ-select-flyout-background'?: string;
    'champ-select-planning-intro'?: string;
    'game-select-icon-default'?: string;
    'game-select-icon-disabled'?: string;
    'game-select-icon-hover'?: string;
    'icon-defeat'?: string;
    'icon-empty'?: string;
    'icon-hover'?: string;
    'icon-leaver'?: string;
    'icon-victory'?: string;
    'parties-background'?: string;
    'social-icon-leaver'?: string;
    'social-icon-victory'?: string;
    'game-select-icon-active'?: string;
    'ready-check-background'?: string;
    'map-north'?: string;
    'map-south'?: string;
    'gameflow-background'?: string;
    'icon-v2'?: string;
    'icon-defeat-v2'?: string;
    'icon-loss-forgiven-v2'?: string;
    'icon-leaver-v2'?: string;
    'gameflow-background-dark'?: string;
    'champ-select-background-sound'?: string;
    'gameselect-button-hover-sound'?: string;
    'music-inqueue-loop-sound'?: string;
    'postgame-ambience-loop-sound'?: string;
    'sfx-ambience-pregame-loop-sound'?: string;
    'ready-check-background-sound'?: string;
    'game-select-icon-active-video'?: string;
    'game-select-icon-intro-video'?: string;
    'icon-defeat-video'?: string;
    'icon-victory-video'?: string;
}

export interface RemoteTutorialCard {
    header: string;
    footer: string;
    description: string;
    imagePath: string;
}

export interface RemoteMapAsset {
    isDefault: boolean
    description: string
    mapStringId: string
    gameMode: string
    gameModeName: string
    gameModeShortName: string
    gameModeDescription: string
    name: string
    gameMutator: string
    isRGM: boolean
    properties: RemoteMapAssetProperties,
    perPositionRequiredSummonerSpells: object
    perPositionDisallowedSummonerSpells: object
    assets: MapAssetAssets
    locStrings: object
    categorizedContentBundles: object
    tutorialCards: RemoteTutorialCard[]
}

export interface RemoteMapAssets {
    [key: string]: RemoteMapAsset[];
}

export interface MapAssets {
    [key: string]: Record<string, RemoteMapAsset | never>;
}

//======================= CURRENT SUMMONER =======================

export interface CurrentSummonerState {
    accountId: number,
    displayName: string,
    gameName: string,
    internalName: string,
    nameChangeFlag: boolean,
    percentCompleteForNextLevel: number,
    privacy: string,
    profileIconId: number,
    puuid: PUUID,
    rerollPoints: {
        currentPoints: number,
        maxRolls: number,
        numberOfRolls: number,
        pointsCostToRoll: number,
        pointsToReroll: number
    },
    summonerId: number,
    summonerLevel: number,
    tagLine: string,
    unnamed: boolean,
    xpSinceLastLevel: number,
    xpUntilNextLevel: number
}

//======================= SUMMONER SPELLS =======================

export interface SummonerSpell {
    id: number,
    name: string,
    description: string,
    summonerLevel: number,
    cooldown: number,
    gameModes: string[],
    iconPath: string,
}

export interface SummonerSpellState extends Record<number, SummonerSpell> {
}


export interface Companion {
    contentId: ContentId,
    itemId: ItemId,
    name: string,
    loadoutsIcon: string
    description: string,
    level: number,
    speciesName: string,
    speciesId: number,
    rarity: string,
    rarityValue: number,
    isDefault: boolean,
    upgrades: ContentId[]
    TFTOnly: boolean,
}

export interface CompanionState extends Record<number, Companion> {}

//======================= SKINS =======================

export interface Skin {
    id: number,
    isBase: boolean,
    name: string,
    splashPath: string,
    uncenteredSplashPath: string,
    tilePath: string,
    loadScreenPath: string,
    loadScreenVintagePath: string,
    skinType: string,
    rarity: string,
    isLegacy: boolean,
    splashVideoPath: string | null,
    collectionSplashVideoPath: string | null,
    featuresText: string | null,
    chromaPath: string | null,
    emblems: unknown,
    regionRarityId: number,
    rarityGemPath: null,
    skinLines: {
        id: number,
    }[],
    skinAugments: null,
    description: string,
    chromas?: {
        id: number,
        name: string,
        chromaPath: string,
        colors: string[],
        description: {
            region: string,
            description: string
        }[],
        rarities: {
            region: string,
            description: number
        }[]
    }[]
}

export interface OwnedSkin {
    expirationDate: string,
    f2p: boolean,
    inventoryType: 'CHAMPION_SKIN',
    itemId: number,
    loyalty: boolean,
    loyaltySources: string[],
    owned: boolean,
    ownershipType: string,
    payload: object;
    purchaseDate: string,
    quantity: number,
    rental: boolean,
    uuid: string,
    wins: number,
}

export interface OwnedSkinState extends Record<number, OwnedSkin> {
}

export interface SkinState extends Record<number, Skin> {
}

//This maps the chroma ID to the parent skin ID
export interface ChromaMap extends Record<number, number> {
}

//This maps the champion ID to the skin IDs
export interface ChampionSkinMap extends Record<number, number[]> {
}

//======================= MATCHMAKING =======================

export interface MatchmakingSearchState extends Record<string, any> {
    dodgeData: {
        dodgerId: number,
        state: string
    },
    lowPriorityData?: {
        bustedLeaverAccessToken: string,
        penalizedSummonerIds: number[],
        penaltyTime: number,
        penaltyTimeRemaining: number,
        reason: string
    },
    estimatedQueueTime: number,
    isCurrentlyInQueue: boolean,
    readyCheck: {
        dodgeWarning: string,
        playerResponse: string,
        state: string,
        suppressUx: boolean,
        timer: number
    }
    searchState: string,
    timeInQueue: number
}


//======================= CHAMP SELECT =======================

export interface ChampSelectState {
    bans: {
        myTeamBans: number[],
        theirTeamBans: number[]
    }
    benchChampions: {
        championId: number,
        isPriority: boolean
    }[],
    benchEnabled: boolean,
    gameId: number,
    hasSimultaneousBans: boolean,
    isCustomGame: boolean,
    localPlayerCellId: number,
    myTeam: {
        assignedPosition: string,
        banAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>,
        cellId: number,
        championId: number,
        championPickIntent: number,
        nameVisibilityType: string,
        obfuscatedpuuid: PUUID,
        obfuscatedSummonerId: number,
        pickAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>
        puuid: PUUID,
        selectedSkinId: number
        spell1Id: number,
        spell2Id: number,
        state: 'PREPARATION' | 'BANNING' | 'AWAITING_PICK' | 'AWAITING_BAN_RESULT' | 'PICKING_WITH_BAN' | 'PICKING_WITHOUT_BAN' | 'AWAITING_FINALIZATION' | 'FINALIZATION',
        summonerId: number,
        team: number,
        wardSkinId: number
    }[],
    rerollsRemaining: number,
    theirTeam: {
        assignedPosition: string,
        banAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>,
        cellId: number,
        championId: number,
        championPickIntent: number,
        nameVisibilityType: string,
        obfuscatedpuuid: PUUID,
        obfuscatedSummonerId: number,
        pickAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>
        puuid: PUUID,
        selectedSkinId: number
        spell1Id: number,
        spell2Id: number,
        state: string
        summonerId: number,
        team: number,
        wardSkinId: number
    }[],
    timer: {
        phase: 'PLANNING' | 'BAN_PICK' | 'FINALIZATION' | 'GAME_STARTING',
        isInfinite: boolean,
    }
}

//========================== Challenges ==========================

export interface LevelMapping<T> {
    IRON: T,
    BRONZE: T,
    SILVER: T,
    GOLD: T,
    PLATINUM: T,
    DIAMOND: T,
    MASTER: T,
    GRANDMASTER: T,
    CHALLENGER: T,
}

export interface ChallengeThreshold {
    rewards?: {
        asset: string,
        category: string,
        name: string,
        quantity: number,
    }[],
    value: number,
}

export interface Challenge {
    name: string,
    description: string,
    descriptionShort: string,
    source: string,
    tags: {
        isCapstone?: 'Y' | 'N',
        isCategory?: 'true' | 'false',
        parent?: string,
        priority?: number,
    },
    queueIds: number[],
    seasons: number[],
    levelToIconPath: LevelMapping<string>,
    thresholds: LevelMapping<ChallengeThreshold>,
    leaderboard: boolean,
    reverseDirection: boolean,
}


export interface Title {
    name: string,
    itemId: number,
    titleAcquisitionName: string,
    titleAcquisitionType: string,
    titleRequirementDescription: string,
    isPermanentTitle: boolean
}


export interface ChallengeData {
    challenges: Record<number, Challenge>,
    titles: Record<string, Title>,
    bannerAccents: []
}

export interface ChallengeState {

}

export interface CategoryProgress {
    category: string,
    current: number,
    level: string,
    max: number,
    positionPercentile: number,
}

export interface ChallengeTitleData {
    challengeDescription: string,
    challengeId: number,
    challengeName: string,
    level: string,
    levelToIconPath: LevelMapping<string>
}

export interface ChallengeTitle {
    backgroundImagePath: string,
    challengeTitleData: ChallengeTitleData,
    contentId: string,
    iconPath: string,
    isPermanentTitle: boolean,
    itemId: number,
    name: string,
    purchaseDate: string,
    titleAcquisitionName: string,
    titleAcquisitionType: string,
    titleRequirementDescription: string
}

export interface TopChallenge {
   availableIds:  never[],
    capstoneGroupId: number,
    capstoneGroupName: string,
    category: string,
    childrenIds: never[],
    completedIds: never[],
    currentLevel: string,
    currentLevelAchievedTime: number,
    currentThreshold: number,
    currentValue: number,
    description: string,
    descriptionShort: string,
    friendsAtLevels: never[],
    gameModes: string[],
    hasLeaderboard: boolean,
    iconPath: string,
    id: number,
    idListType: string,
    isApex: boolean,
    isCapstone: boolean,
    isReverseDirection: boolean,
    levelToIconPath: LevelMapping<string>,
    name: string,
    nextLevel: string,
    nextLevelIconPath: string,
    nextThreshold: number,
    parentId: number,
    parentName: string,
    percentile: number,
    playersInLevel: number,
    pointsAwarded: number,
    position: number,
    previousLevel: string,
    previousValue: number,
    priority: number,
    retireTimestamp: number,
    source: string,
    thresholds: LevelMapping<ChallengeThreshold>,
    valueMapping: string
}

export interface ChallengeSummary {
    apexLadderUpdateTime: number,
    apexLeaderboardPosition: number,
    categoryProgress: CategoryProgress[],
    crestId: string,
    isApex: boolean,
    overallChallengeLevel: string,
    pointsUntilNextRank: number,
    positionPercentile: number,
    prestigeCrestBorderLevel: number,
    selectedChallengesString: string,
    title: ChallengeTitle
    topChallenges: [TopChallenge, TopChallenge, TopChallenge]
    totalChallengeScore: number
}

export interface ChallengeSummaryUpdate {
    id: PUUID,
    data: ChallengeSummary
}

export interface ChallengeSummaryState extends Record<PUUID, ChallengeSummary> {}

//======================= Generic Presence =======================

export interface GenericPresence {
    availability: SocialAvailability,
    gameName: string,
    gameTag: string,
    icon: number,
    id: ID,
    lol: LolPresence,
    name: string,
    obfuscatedSummonerId: number,
    patchline: string,
    pid: ID,
    platformId: string,
    product: string,
    productName: string,
    puuid: PUUID,
    statusMessage: string,
    summary: string,
    summonerId: SUMMONER_ID,
    time: number
}

export interface GenericPresenceState extends Record<ID, GenericPresence> {}

//======================= DRAG AND DROP =======================
export enum DragType {
    FRIEND = 'FRIEND'
}

export interface GenericDragAndDropData {
    key: DragType,
    data: any,
}

export interface FriendDragData extends GenericDragAndDropData {
    key: DragType.FRIEND,
    data: Friend
}

//=========================================================
//======================= UI STATES =======================
//=========================================================

export interface WindowFocusState {
    focused: boolean;
}

//======================= CONTAINER =======================
export enum ContainerState {
    NONE = 'None',
    PLAY = 'Play',
    COLLECTION = 'Collection',
    LOOT = 'Loot',
    TASKS = 'Tasks',
    CONFIG = 'Configuration',
    PROFILE = 'Profile'
}

export interface ActiveContainerState {
    container: ContainerState,
}