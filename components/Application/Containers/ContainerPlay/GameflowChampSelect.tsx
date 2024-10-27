import {AppState} from '../../../../store';
import {useSelector} from 'react-redux';
import * as Globals from '../../../../Globals';
import styles from '../../../../styles/Application/Containers/ContainerPlay/GameflowChampSelect.module.css';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ChampionSelector, {SelectorOptions} from './GameflowChampSelect/ChampionSelector';
import PrettyImage from '../../../General/PrettyImage';
import RuneSelector from '../../../General/RuneSelector';
import axios from 'axios';
import ReworkedSkinSelector from './GameflowChampSelect/ReworkedSkinSelector';
import {useState} from 'react';


enum PHASES {
    PREPARATION = 'PREPARATION',
    BANNING = 'BANNING',
    AWAITING_PICK = 'AWAITING_PICK',
    AWAITING_BAN_RESULT = 'AWAITING_BAN_RESULT',
    PICKING_WITH_BAN = 'PICKING_WITH_BAN',
    PICKING_WITHOUT_BAN = 'PICKING_WITHOUT_BAN',
    AWAITING_FINALIZATION = 'AWAITING_FINALIZATION',
    FINALIZATION = 'FINALIZATION',
}

export default function GameflowChampSelect() {
    function log(...args: unknown[]): void {
        console.log(
            '[GameflowChampSelect]',
            ...args
        );
    }

    const [runeSelectorVisible, setRuneSelectorVisible] = useState<boolean>(false);

    const lobby = useSelector((state: AppState) => state.lobbyState);
    const champSelect = useSelector((state: AppState) => state.champSelectState);

    const chromaToSkin = useSelector((state: AppState) => state.chromaToParentSkin);

    const skins = useSelector((state: AppState) => state.skins);
    const summonerSpells = useSelector((state: AppState) => state.summonerSpells);
    const champions = useSelector((state: AppState) => state.champions);

    if (lobby === null || champSelect === null || skins === null || summonerSpells === null || champions === null) {
        return (<></>);
    }

    const lobbyGamemode = lobby?.gameConfig?.gameMode;

    const validChampionId = (championId: number) => {
        return -1 != championId && champions[championId] !== undefined;
    };
    const getSpellPathFromSpellId = (spellId: number) => {
        if (summonerSpells[spellId]?.iconPath === undefined) {
            return '';
        }
        return Globals.PROXY_STATIC_PREFIX + summonerSpells[spellId]?.iconPath;
    };
    const getCenteredSplashartUrlFromSkinId = (skinId: number) => {
        const parentSkinId = chromaToSkin[skinId] ?? skinId;

        const splashUrl = skins[parentSkinId]?.splashPath;
        return Globals.PROXY_STATIC_PREFIX + splashUrl;
    };

    const getChampionBanImage = (championId: number) => {
        return Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/champion-icons/' + championId + '.png';
    };

    const getChampionName = (championId: number) => {
        return champions[championId]?.name ?? 'Unknown Champion';
    };

    const renderChampionNameTooltip = (championId: number) => {
        return (
            <Tooltip className={styles.championNameTooltipFont}>
                {
                    getChampionName(championId)
                }
            </Tooltip>
        );
    };

    const renderBGImageFromPickIntent = (pickIntent: number) => {
        if (pickIntent === undefined || pickIntent === -1 || pickIntent === 0) {
            return (<></>);
        }
        return (
            <div className={styles.finalizationBGContainer}>
                <img
                    src={getCenteredSplashartUrlFromSkinId(pickIntent * 1000)}
                    className={styles.finalizationBGImage}
                />
                <div className={styles.finalizationBGFilter}/>
            </div>
        );
    };

    const renderPositionIcon = (position: string | undefined) => {
        if (position === undefined || position === '') {
            return (<></>);
        }
        return (
            <img src={`${Globals.STATIC_PREFIX}/assets/svg/positions/${position}.svg`} className={styles.positionImage}
                draggable={false}/>
        );
    };

    const renderMyTeamClassic = () => {
        const myTeamArray = [];

        const arrayLength = champSelect.myTeam?.length ?? 0;

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {
            if (index >= arrayLength) {
                myTeamArray.push(
                    <div key={'invalid ' + index}></div>
                );
                continue;
            }

            const currentMember = champSelect.myTeam[index];

            const BORDER_CLASS_STYLE = (currentMember.cellId === champSelect.localPlayerCellId) ? styles.champSelectPICKING_SELF : styles.champSelectPICKING;

            switch (currentMember?.state) {
                case PHASES.PREPARATION:
                    myTeamArray.push(
                        <div className={styles.champSelectFINALIZATION} key={'MyTeamPick-' + index}>
                            <div className={styles.borderBox}>
                                {
                                    renderBGImageFromPickIntent(currentMember?.championPickIntent)
                                }
                                <div className={styles.teammateContent}>
                                    <div className={styles.statusContainer}>
                                        Declaring Intent
                                    </div>
                                    <div className={styles.positionContainer}>
                                        {
                                            renderPositionIcon(currentMember?.assignedPosition)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case PHASES.BANNING:
                    myTeamArray.push(
                        <div className={styles.champSelectBANNING} key={'MyTeamPick-' + index}>
                            <div className={styles.borderBox}>
                                <div className={styles.banningBGContainer}>
                                    {
                                        validChampionId(currentMember.banAction.championId) ? (
                                            <>
                                                <PrettyImage
                                                    useLoader={false}
                                                    imgProps={{
                                                        src: getCenteredSplashartUrlFromSkinId(currentMember.banAction.championId * 1000)
                                                    }}
                                                    className={styles.banningBGImage}
                                                />
                                                <div className={styles.banningBGFilter}/>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.banningBGFilter}/>
                                            </>
                                        )
                                    }

                                </div>
                                <div className={styles.teammateContent}>
                                    <div className={styles.statusContainer}>
                                        <div className={styles.singleStatus}>
                                            Banning...
                                        </div>
                                        <div className={styles.singleStatus}>
                                            {
                                                getChampionName(currentMember.banAction.championId)
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.positionContainer}>
                                        {
                                            renderPositionIcon(currentMember.assignedPosition)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case PHASES.AWAITING_PICK:
                    myTeamArray.push(
                        <div className={styles.champSelectFINALIZATION} key={'MyTeamPick-' + index}>
                            <div className={styles.finalizationBGContainer}>
                                {
                                    renderBGImageFromPickIntent(currentMember.pickAction.championId)
                                }
                                <div className={styles.finalizationBGFilter}/>
                            </div>
                            <div className={styles.teammateContent}>
                                <div className={styles.finalizationContentSummonerSpells}>
                                    <div className={styles.finalizationContentSummonerSpellContainer}>
                                        <img className={styles.champSelectComponentSummonerSpellImage}
                                            draggable={false}
                                            alt={''}
                                            src={getSpellPathFromSpellId(currentMember.spell1Id)}
                                        />
                                    </div>
                                    <div className={styles.finalizationContentSummonerSpellContainer}>
                                        <PrettyImage className={styles.champSelectComponentSummonerSpellImage}
                                            imgProps={{
                                                src: getSpellPathFromSpellId(currentMember.spell2Id),
                                                alt: '',
                                                draggable: false
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.statusContainer}>
                                    Awaiting Pick
                                </div>
                                <div className={styles.positionContainer}>
                                    {
                                        renderPositionIcon(currentMember.assignedPosition)
                                    }
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case PHASES.PICKING_WITH_BAN:
                case PHASES.PICKING_WITHOUT_BAN:
                    myTeamArray.push(
                        <div className={BORDER_CLASS_STYLE} key={'MyTeamPick-' + index}>
                            <div className={styles.borderBox}>
                                <div className={styles.pickingBGContainer}>
                                    {
                                        validChampionId(currentMember.pickAction.championId) ? (
                                            <div key={currentMember.pickAction.championId}>
                                                <img
                                                    src={getCenteredSplashartUrlFromSkinId(currentMember.pickAction.championId * 1000)}
                                                    className={styles.pickingBGImage}/>
                                                <div className={styles.pickingBGFilter}/>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.pickingBGFilter}/>
                                            </>
                                        )
                                    }
                                </div>
                                <div className={styles.teammateContent}>
                                    <div className={styles.statusContainer}>
                                        <div className={styles.singleStatus}>
                                            Picking...
                                        </div>
                                        <div className={styles.singleStatus}>
                                            {getChampionName(currentMember.pickAction.championId)}
                                        </div>

                                    </div>
                                    <div className={styles.positionContainer}>
                                        {
                                            renderPositionIcon(currentMember.assignedPosition)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case PHASES.AWAITING_FINALIZATION:
                    myTeamArray.push(
                        <div className={styles.champSelectFINALIZATION} key={'MyTeamPick-' + index}>
                            <div className={styles.finalizationBGContainer}>
                                <img
                                    src={getCenteredSplashartUrlFromSkinId(currentMember.selectedSkinId)}
                                    className={styles.finalizationBGImage}
                                />
                                <div className={styles.finalizationBGFilter}/>
                            </div>
                            <div className={styles.teammateContent}>
                                <div className={styles.finalizationContentSummonerSpells}>
                                    <div className={styles.finalizationContentSummonerSpellContainer}>
                                        <img className={styles.champSelectComponentSummonerSpellImage}
                                            draggable={false}
                                            alt={''}
                                            src={getSpellPathFromSpellId(currentMember.spell1Id)}
                                        />
                                    </div>
                                    <div className={styles.finalizationContentSummonerSpellContainer}>
                                        <img className={styles.champSelectComponentSummonerSpellImage}
                                            draggable={false}
                                            alt={''}
                                            src={getSpellPathFromSpellId(currentMember.spell2Id)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.championNameContainer}>
                                    {
                                        currentMember.championId ? (champions[currentMember.championId] ? champions[currentMember.championId].name : '') : ''
                                    }
                                </div>
                                <div className={styles.positionContainer}>
                                    {
                                        renderPositionIcon(currentMember.assignedPosition)
                                    }
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case PHASES.FINALIZATION:
                    myTeamArray.push(
                        <div className={styles.champSelectFINALIZATION} key={'MyTeamPick-' + index}>
                            <div className={styles.finalizationBGContainer}
                                key={currentMember.pickAction.championId}>
                                <img
                                    src={getCenteredSplashartUrlFromSkinId(currentMember.selectedSkinId)}
                                    className={styles.finalizationBGImage}
                                />
                                <div className={styles.finalizationBGFilter}/>
                            </div>
                            <div className={styles.teammateContent}>
                                <div className={styles.finalizationContentSummonerSpells}>
                                    <div className={styles.finalizationContentSummonerSpellContainer}>
                                        <img className={styles.champSelectComponentSummonerSpellImage}
                                            draggable={false}
                                            alt={' '}
                                            src={getSpellPathFromSpellId(currentMember.spell1Id)}
                                        />
                                    </div>
                                    <div className={styles.finalizationContentSummonerSpellContainer}>
                                        <img className={styles.champSelectComponentSummonerSpellImage}
                                            draggable={false}
                                            alt={' '}
                                            src={getSpellPathFromSpellId(currentMember.spell2Id)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.championNameContainer}>
                                    {
                                        getChampionName(currentMember.championId)
                                    }
                                </div>
                                <div className={styles.positionContainer}>
                                    {
                                        renderPositionIcon(currentMember.assignedPosition)
                                    }
                                </div>
                            </div>
                        </div>
                    );
                    break;
            }
        }

        return myTeamArray;
    };

    const renderEnemyTeamClassic = () => {
        const theirTeamArray = [];

        const arrayLength = champSelect.theirTeam?.length ?? 0;

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {
            if (index >= arrayLength) {
                theirTeamArray.push(
                    <div key={'invalid ' + index}></div>
                );
                continue;
            }

            const currentMember = champSelect.theirTeam[index];

            if (currentMember == null) {
                continue;
            }

            switch (currentMember?.state) {
                case PHASES.PREPARATION:
                    theirTeamArray.push(
                        <div className={styles.champSelectFINALIZATION} key={'TheirTeamPick-' + index}>
                            <div className={styles.borderBox}>
                                {
                                    renderBGImageFromPickIntent(currentMember?.championPickIntent ? currentMember.championPickIntent : 0)
                                }
                                <div className={styles.teammateContent}>
                                    <div className={styles.statusContainer}>
                                        Declaring Intent
                                    </div>
                                    <div className={styles.positionContainer}>
                                        {
                                            renderPositionIcon(currentMember?.assignedPosition)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;
                case PHASES.BANNING:
                    theirTeamArray.push(
                        <div>

                        </div>
                    );
                    break;
                default:
                    theirTeamArray.push(
                        <div className={styles.champSelectFINALIZATION} key={'MyTeamPick-' + index}>
                            <div className={styles.finalizationBGContainer}
                                key={currentMember.pickAction.championId}>
                                <PrettyImage
                                    useLoader={false}
                                    imgProps={{
                                        src: getCenteredSplashartUrlFromSkinId(currentMember.selectedSkinId)
                                    }}
                                    className={styles.finalizationBGImage}
                                />
                                <div className={styles.finalizationBGFilter}/>
                            </div>
                            <div className={styles.teammateContent}>
                                <div className={styles.finalizationContentSummonerSpells}>

                                </div>
                                <div className={styles.enemyChampionNameContainer}>
                                    {
                                        getChampionName(currentMember.championId)
                                    }
                                </div>
                                <div className={styles.positionContainer}>
                                    {
                                        renderPositionIcon(currentMember.assignedPosition)
                                    }
                                </div>
                            </div>
                        </div>
                    );
                    break;
            }
        }

        return theirTeamArray;
    };

    const renderAramSelector = () => {
        const localPlayer = champSelect.myTeam?.find((member) => {
            return member.cellId === champSelect.localPlayerCellId;
        });

        if (localPlayer === undefined) {
            return (
                <></>
            );
        }

        return <ReworkedSkinSelector championId={localPlayer.championId} initialSkinId={localPlayer.selectedSkinId}/>;
    };


    const renderSelector = () => {
        const localPlayer = champSelect.myTeam?.find((member) => {
            return member.cellId === champSelect.localPlayerCellId;
        });

        if (localPlayer === undefined) {
            return (
                <></>
            );
        }

        const combinedBans = [];

        if (champSelect.bans?.myTeamBans) {
            combinedBans.push(...champSelect.bans.myTeamBans);
        }

        if (champSelect.bans?.theirTeamBans) {
            combinedBans.push(...champSelect.bans.theirTeamBans);
        }

        const combinedPicks: number[] = [];

        if (champSelect.myTeam) {
            champSelect.myTeam.forEach((member) => {
                const pickAction = member.pickAction;
                if (pickAction === undefined) {
                    return;
                }

                if (pickAction.completed) {
                    combinedPicks.push(pickAction.championId);
                }
            });
        }

        if (champSelect.theirTeam) {
            champSelect.theirTeam.forEach((member) => {
                const pickAction = member.pickAction;
                if (pickAction === undefined) {
                    return;
                }

                if (pickAction.completed) {
                    combinedPicks.push(pickAction.championId);
                }
            });
        }

        switch (localPlayer.state) {
            case PHASES.PREPARATION:
                return (
                    <ChampionSelector bannedChampionIds={combinedBans} selectedChampionIds={combinedPicks}
                        allowLockIn={false} selectorMode={SelectorOptions.PICK}/>
                );
            case PHASES.AWAITING_BAN_RESULT:
                return (
                    <></>
                );
            case PHASES.BANNING:
                return (
                    <ChampionSelector bannedChampionIds={combinedBans} selectedChampionIds={combinedPicks}
                        allowLockIn={true} selectorMode={SelectorOptions.BAN}/>
                );
            case PHASES.AWAITING_PICK:
                return (
                    <ChampionSelector bannedChampionIds={combinedBans} selectedChampionIds={combinedPicks}
                        allowLockIn={false} selectorMode={SelectorOptions.PICK}/>
                );
            case PHASES.PICKING_WITH_BAN:
            case PHASES.PICKING_WITHOUT_BAN:
                return (
                    <ChampionSelector bannedChampionIds={combinedBans} selectedChampionIds={combinedPicks}
                        allowLockIn={true} selectorMode={SelectorOptions.PICK}/>
                );
            case PHASES.AWAITING_FINALIZATION:
            case PHASES.FINALIZATION:
                return (
                    <div className={styles.skinSelector}>
                        <ReworkedSkinSelector championId={localPlayer.pickAction.championId}
                            initialSkinId={localPlayer.selectedSkinId}/>
                    </div>
                );
            default:
                return (
                    <ChampionSelector bannedChampionIds={combinedBans} selectedChampionIds={combinedPicks}
                        allowLockIn={false} selectorMode={SelectorOptions.PICK}></ChampionSelector>
                );
        }

    };

    const renderClassicLobby = () => {

        return (
            <div className={styles.defaultChampSelectContainer}>
                <div className={styles.myTeamContainer}>
                    <div className={styles.myTeamBansSection}>
                        {
                            champSelect.bans?.myTeamBans.filter(
                                (bannedChampionId) => {
                                    return validChampionId(bannedChampionId);
                                }
                            ).map(
                                (bannedChampionId) => {
                                    return (
                                        <div key={bannedChampionId} className={styles.singleBanContainer}>
                                            <OverlayTrigger overlay={renderChampionNameTooltip(bannedChampionId)}
                                                placement={'bottom'} delay={{show: 250, hide: 250}}>
                                                <div className={styles.banIconContainer}>
                                                    <PrettyImage imgProps={{
                                                        className: styles.icon,
                                                        src: getChampionBanImage(bannedChampionId),
                                                        alt: ''
                                                    }}/>
                                                </div>
                                            </OverlayTrigger>
                                        </div>
                                    );
                                }
                            )
                        }
                    </div>
                    <div className={styles.myTeamPickSection}>
                        {
                            renderMyTeamClassic()
                        }
                    </div>
                    <div className={styles.myTeamUtilSection}>

                    </div>
                </div>
                <div className={styles.middleContainer}>
                    <div className={styles.middleTopSection}>

                    </div>
                    <div className={styles.middleMidSection}>
                        {
                            renderSelector()
                        }
                    </div>
                    <div className={styles.middleBotSection}>
                        <div onClick={() => setRuneSelectorVisible(true)}>
                            TEST
                        </div>
                        {runeSelectorVisible ? <RuneSelector setVisible={setRuneSelectorVisible}/> : <></>}
                    </div>
                </div>
                <div className={styles.enemyTeamContainer}>
                    <div className={styles.enemyTeamBansSection}>
                        {
                            champSelect.bans?.theirTeamBans
                                .filter((bannedChampionId) => {
                                    return validChampionId(bannedChampionId);
                                })
                                .map(
                                    (bannedChampionId) => {
                                        return (
                                            <div key={bannedChampionId} className={styles.singleBanContainer}>
                                                <div className={styles.banIconContainer}>
                                                    <OverlayTrigger
                                                        overlay={renderChampionNameTooltip(bannedChampionId)}
                                                        placement={'bottom'} delay={{show: 250, hide: 250}}>
                                                        <PrettyImage imgProps={{
                                                            className: styles.icon,
                                                            src: getChampionBanImage(bannedChampionId),
                                                            alt: ''
                                                        }}/>
                                                    </OverlayTrigger>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                        }
                    </div>
                    <div className={styles.enemyTeamPickSection}>
                        {
                            renderEnemyTeamClassic()
                        }
                    </div>
                    <div className={styles.enemyTeamUtilSection}>

                    </div>
                </div>
            </div>
        );
    };

    const renderAramBench = () => {
        const swapToChampion = (championId: number) => {
            axios.post(Globals.PROXY_PREFIX + '/lol-champ-select/v1/session/bench/swap/' + championId)
                .then(() => {
                })
                .catch(() => {
                });
        };

        return (
            <div className={styles.aramBench}>
                {
                    champSelect.benchChampions?.map((benchChampion) => {
                        const champion = champions[benchChampion.championId];

                        return (
                            <div className={styles.benchChampionContainer} key={benchChampion.championId}
                                onClick={() => {
                                    swapToChampion(benchChampion.championId);
                                }}>
                                <PrettyImage imgProps={{
                                    className: styles.icon,
                                    src: getChampionBanImage(benchChampion.championId),
                                    alt: ''
                                }}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const reroll = () => {
        axios.post(Globals.PROXY_PREFIX + '/lol-champ-select/v1/session/my-selection/reroll')
            .then(() => {
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const donateReroll = () => {
        axios.post(
            Globals.REST_V1_PREFIX + '/champ-select/donate-reroll',
            {}
        )
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const renderARAMLobby = () => {
        return (
            <div className={styles.defaultChampSelectContainer}>
                <div className={styles.myTeamContainer}>
                    <div className={styles.myTeamBansSection}>
                    </div>
                    <div className={styles.myTeamPickSection}>
                        {
                            renderMyTeamClassic()
                        }
                    </div>
                    <div className={styles.myTeamUtilSection}>

                    </div>
                </div>
                <div className={styles.middleContainer}>
                    <div className={styles.middleTopSection}>
                        {
                            renderAramBench()
                        }
                    </div>
                    <div className={styles.middleMidSection}>
                        <div className={styles.aramSkinSelector}>
                            {
                                renderAramSelector()
                            }
                        </div>
                        <div className={styles.aramButtons}>
                            <button onClick={reroll}>
                                Reroll
                            </button>
                            <button onClick={donateReroll}>
                                Donate Reroll
                            </button>
                        </div>
                    </div>
                    <div className={styles.middleBotSection}>

                    </div>
                </div>
                <div className={styles.enemyTeamContainer}>
                    <div className={styles.enemyTeamBansSection}>
                    </div>
                    <div className={styles.enemyTeamPickSection}>
                        {
                            renderEnemyTeamClassic()
                        }
                    </div>
                    <div className={styles.enemyTeamUtilSection}>

                    </div>
                </div>
            </div>
        );
    };


    // TFT actually skips champ select, and locks in Kai'Sa for everyone. We can just render a game in progress screen.
    const renderTFTLobby = () => {
        return (
            <>
                TFT Champ Select
            </>
        );
    };


    const renderArenaLobby = () => {
        return (
            <>
                Arena Champ Select
            </>
        );
    };


    const renderLobbyBasedOnGamemode = (gamemode: string | undefined) => {
        //This approach has some weaknesses, but it's good enough for now.
        //For example custom games dont work properly because their gameMode is not dependent on the gameMode of the lobby.
        //But rather on the gameConfig provided. For now we will just ignore this case.
        switch (gamemode) {
            case Globals.KNOWN_GAME_MODES.CLASSIC:
                return renderClassicLobby();
            case Globals.KNOWN_GAME_MODES.ARAM:
                return renderARAMLobby();
            case Globals.KNOWN_GAME_MODES.TFT:
                return renderTFTLobby();
            case Globals.KNOWN_GAME_MODES.ARENA:
                return renderArenaLobby();
            default:
                log(
                    'Unknown Gamemode: ',
                    lobbyGamemode
                );
                // If we don't know the Gamemode / don't actively support it, just fallback to the classic lobby
                return renderClassicLobby();
        }
    };
    return (
        <div className={styles.baseContainer}>
            {
                renderLobbyBasedOnGamemode(lobbyGamemode)
            }
        </div>
    );
}