import styles from '../../../styles/Application/Containers/ContainerLoot.module.css';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {LootItem, LootState} from '../../../types/Store';
import * as Globals from '../../../Globals';
import axios from 'axios';
import LootFeedback, {ErrorResponse, LootResponse} from './ContainerLoot/LootFeedback';
import PrettyImage from '../../General/PrettyImage';

enum DisplayCategory {
    SKIN = 'SKIN',
    CHAMPION = 'CHAMPION',
    EMOTE = 'EMOTE',
    WARD = 'WARDSKIN',
    ICON = 'SUMMONERICON',
    CHEST = 'CHEST',
}

enum Types {
    CURRENCY = 'CURRENCY',
    MATERIAL = 'MATERIAL',
    EMOTE = 'EMOTE',
    TOURNAMENTLOGO = 'TOURNAMENTLOGO',
    WARDSKIN_RENTAL = 'WARDSKIN_RENTAL',
    CHAMPION_RENTAL = 'CHAMPION_RENTAL',
    SKIN_RENTAL = 'SKIN_RENTAL',
    CHEST = 'CHEST',
}

const DROP_ORIGIN_INVENTORY = 'inventory';
const DROP_ORIGIN_SELECTION = 'selection';

const LOOT_ALREADY_OWNED = 'ALREADY_OWNED';

export default function ContainerLoot() {

    const [awaitingDisenchant, setAwaitingDisenchant] = useState(false);
    const [latestResponse, setLatestResponse] = useState<LootResponse | ErrorResponse | undefined>(undefined);
    const loot = useSelector((state: AppState) => state.lootState);

    const [selection, setSelection] = useState('none');

    const [disenchantLoot, setDisenchantLoot] = useState<Record<string, LootItem>>({});
    const [displayLoot, setDisplayLoot] = useState<Record<string, LootItem>>({});

    if (loot === null) {
        return (<></>);
    }

    const filterLoot = (passedLoot: LootState | undefined): Record<string, LootItem> => {
        if (passedLoot === undefined) {
            return {};
        }
        const newLoot = {};
        Object.values(passedLoot).filter(
            (item) => {
                if (item === undefined) {
                    return false;
                }
                if (item.itemDesc === undefined) {
                    return false;
                }
                if (item.lootName.startsWith('CHAMPION_TOKEN')) {
                    return false;
                } else if (item.displayCategories.toLowerCase() !== selection) {
                    return false;
                }
                return true;
            }
        ).forEach((oldItem) => {
            const item = {...oldItem};
            newLoot[item.lootName] = item;
        });
        return newLoot;
    };

    useEffect(
        () => {
            triggerAsncUpdate();
            setDisplayLoot(filterLoot(loot));
        },
        [selection]
    );

    const triggerAsncUpdate = () => {
        console.log('[Loot]: Triggering async loot update');
        axios.post(Globals.PROXY_PREFIX + '/lol-loot/v1/refresh')
            .then((response) => {
                console.log('[Loot]: Async loot update triggered');
            }).catch((error) => {
                console.error(error);
            });
    };


    const resetSelection = () => {
        setDisenchantLoot({});
        setDisplayLoot(filterLoot(loot));
    };

    const selectOwnedContent = () => {
        const newDisenchantLoot = {};
        const newDisplayLoot = {};
        Object.values(filterLoot(loot)).map((item) => {
            if (item.redeemableStatus === LOOT_ALREADY_OWNED) {
                newDisenchantLoot[item.lootName] = item;
            } else {
                newDisplayLoot[item.lootName] = item;
            }
        });
        setDisplayLoot(newDisplayLoot);
        setDisenchantLoot(newDisenchantLoot);
    };

    const selectLowValueContent = () => {
        const newDisenchantLoot = {};
        const newDisplayLoot = {};
        Object.values(filterLoot(loot)).map((item) => {
            if (item.rarity === 'DEFAULT') {
                newDisenchantLoot[item.lootName] = item;
            } else {
                newDisplayLoot[item.lootName] = item;
            }
        });
        setDisplayLoot(newDisplayLoot);
        setDisenchantLoot(newDisenchantLoot);
    };

    const selectDuplicateContent = () => {
        const newDisenchantLoot = {};
        const newDisplayLoot = {};
        const filteredLoot = filterLoot(loot);
        console.log(loot);
        console.log(filteredLoot);

        Object.values(filteredLoot).map((item) => {
            if (item.count > 1) {
                item.count -= 1;
                newDisenchantLoot[item.lootName] = Object.assign(
                    {},
                    item
                );
                item.count = 1;
            }
            newDisplayLoot[item.lootName] = item;
        });
        setDisplayLoot(newDisplayLoot);
        setDisenchantLoot(newDisenchantLoot);
    };

    const sendOpenLoot = () => {
        if (awaitingDisenchant || Globals.isEmptyObject(disenchantLoot)) {
            return;
        }

        const lootToDisenchant = [];

        Object.values(disenchantLoot).forEach((item) => {
            lootToDisenchant.push(item);
        });
        setDisenchantLoot({});
        setAwaitingDisenchant(true);

        const item = lootToDisenchant[0];

        axios.post(
            Globals.REST_V1_PREFIX + '/loot/craft/' + 'OPEN' + '/' + item.lootId,
            item
        ).then((response) => {
            setLatestResponse(response.data as LootResponse);
            console.log(response.data);
        }).catch((error) => {
            setLatestResponse(error.response.data as ErrorResponse);
            console.error(error);
        });
    };

    const sendRerollLoot = () => {
        if (awaitingDisenchant || Globals.isEmptyObject(disenchantLoot)) {
            return;
        }
        const lootToDisenchant = [];
        Object.values(disenchantLoot).forEach((item) => {
            lootToDisenchant.push(item);
        });
        setDisenchantLoot({});
        setAwaitingDisenchant(true);
        console.log(lootToDisenchant.length);
        axios.post(
            Globals.REST_V1_PREFIX + '/loot/reroll',
            lootToDisenchant
        )
            .then((response) => {
                setLatestResponse(response.data as LootResponse);
                console.log(response.data);
            })
            .catch((error) => {
                setLatestResponse(error.response.data as ErrorResponse);
                console.error(error);
            });
    };

    const sendDisenchantLoot = () => {
        if (awaitingDisenchant || Globals.isEmptyObject(disenchantLoot)) {
            return;
        }
        const lootToDisenchant = [];
        Object.values(disenchantLoot).forEach((item) => {
            lootToDisenchant.push(item);
        });
        setDisenchantLoot({});
        setAwaitingDisenchant(true);
        axios.post(
            Globals.REST_V1_PREFIX + '/loot/disenchant',
            lootToDisenchant
        )
            .then((response) => {
                setLatestResponse(response.data as LootResponse);
                console.log(response.data);
            })
            .catch((error) => {
                setLatestResponse(error.response.data as ErrorResponse);
                console.error(error);
            });
        setAwaitingDisenchant(true);
    };

    if (loot === undefined) {
        return (<>
            Loading...
        </>);
    }


    const handleDropToDisplay = (event) => {
        event.preventDefault();

        const itemData = event.dataTransfer.getData('text/plain');
        const item = JSON.parse(itemData);

        if (item.origin === DROP_ORIGIN_INVENTORY) {
            return;
        } else {
            delete item.origin;
        }

        const lootName = item.lootName;

        const updatedDisenchantLoot = {...disenchantLoot};
        const originalCount = disenchantLoot[lootName].count;
        if (originalCount >= 1) {
            delete updatedDisenchantLoot[lootName];
        } else {
            return;
        }
        setDisenchantLoot(updatedDisenchantLoot);

        const updatedLoot = {...displayLoot};
        if (displayLoot[lootName] === undefined) {
            item.count = originalCount;
            updatedLoot[lootName] = item;
        } else {
            updatedLoot[lootName].count += originalCount;
        }
        setDisplayLoot(updatedLoot);
    };

    const handleDropToDisenchant = (event) => {
        event.preventDefault();

        const itemData = event.dataTransfer.getData('text/plain');
        const item = JSON.parse(itemData);

        if (item.origin === DROP_ORIGIN_SELECTION) {
            return;
        } else {
            delete item.origin;
        }

        const lootName = item.lootName;

        const updatedLoot = {...displayLoot};
        const originalCount = displayLoot[lootName].count;
        if (originalCount >= 1) {
            delete updatedLoot[lootName];
        } else {
            return;
        }
        setDisplayLoot(updatedLoot);

        const updatedDisenchantLoot = {...disenchantLoot};
        if (disenchantLoot[lootName] === undefined) {
            item.count = originalCount;
            updatedDisenchantLoot[lootName] = item;
        } else {
            updatedDisenchantLoot[lootName].count += originalCount;
        }
        setDisenchantLoot(updatedDisenchantLoot);

    };

    const moveOneElement = (item, origin, destination, setOrigin, setDestination) => {
        const preCopy = JSON.stringify(item);

        const itemCopy = JSON.parse(preCopy);

        const name = item.lootName;
        const updatedOrigin = {...origin};
        const originalCount = origin[name].count;
        if (originalCount >= 1) {
            if (originalCount === 1) {
                delete updatedOrigin[name];
            } else {
                updatedOrigin[name].count = originalCount - 1;
            }
        } else {
            return;
        }

        const updatedDestination = {...destination};
        if (updatedDestination[name] === undefined) {
            itemCopy.count = 1;
            updatedDestination[name] = itemCopy;
        } else {
            updatedDestination[name].count += 1;
        }

        setOrigin(updatedOrigin);

        setDestination(updatedDestination);
    };

    const handleDragStart = (event, item, origin) => {
        item.origin = origin;
        const itemData = JSON.stringify(item);
        event.dataTransfer.setData(
            'text/plain',
            itemData
        );
    };

    const changeSelection = (newSelection) => {
        setSelection(newSelection);
        resetSelection();
    };

    const dismiss = () => {
        setAwaitingDisenchant(false);
        setLatestResponse(undefined);
    };

    return (
        <div className={styles.content}>
            {selection}<br></br>
            Awaiting Disenchant: {awaitingDisenchant ? 'true' : 'false'}<br></br>
            <button onClick={() => {
                changeSelection('skin');
            }}>Skins
            </button>
            <button onClick={() => {
                changeSelection('champion');
            }}>Champions
            </button>
            <button onClick={() => {
                changeSelection('wardskin');
            }}>Wards
            </button>
            <button onClick={() => {
                changeSelection('emote');
            }}>Emotes
            </button>
            <button onClick={() => {
                changeSelection('summonericon');
            }}>Icons
            </button>
            <button onClick={() => {
                changeSelection('chest');
            }}>chest
            </button>
            <br/>
            Owned Content:<br></br>
            <button onClick={() => {
                selectOwnedContent();
            }}>Select owned
            </button>
            <button onClick={() => {
                selectLowValueContent();
            }}>Select low value
            </button>
            <button onClick={() => {
                selectDuplicateContent();
            }}>Select duplicates
            </button>
            <div className={styles.currentLootContainer} onDragOver={(e) => {
                e.preventDefault();
            }} onDrop={(e) => handleDropToDisplay(e)}>
                {
                    Object.values(displayLoot).sort((a, b) => {
                        return a.itemDesc.localeCompare(b.itemDesc);
                    }).map((item: LootItem) => {
                        return (<div key={'Loot-' + item.lootId} className={styles.lootElement} draggable={true}
                            onDragStart={(e) => {
                                handleDragStart(
                                    e,
                                    item,
                                    DROP_ORIGIN_INVENTORY
                                );
                            }} onClick={() => moveOneElement(
                                item,
                                displayLoot,
                                disenchantLoot,
                                setDisplayLoot,
                                setDisenchantLoot
                            )}>
                            <div className={styles.imageContainer}>
                                <PrettyImage
                                    className={styles.lootImage}
                                    useLoader={true}
                                    imgProps={{
                                        src: Globals.PROXY_STATIC_PREFIX + item.tilePath,
                                        alt: '',
                                        loading: 'lazy'
                                    }}
                                />
                            </div>
                            <div className={styles.lootDescription} draggable={false}>
                                <br></br>
                                <span>{item.displayCategories}<br/></span>
                                <span>{Globals.getReadableLootCategoryName(item.type)}<br/></span>
                                <span>{item.itemDesc} x{item.count}<br></br></span>
                            </div>
                        </div>);


                    })
                }
            </div>
            <div className={styles.disenchantLootContainer} onDragOver={(e) => {
                e.preventDefault();
            }} onDrop={(e) => handleDropToDisenchant(e)}>
                {
                    Object.values(disenchantLoot).sort((a, b) => {
                        return a.itemDesc.localeCompare(b.itemDesc);
                    }).map((item) => {
                        return (<div key={'Loot-' + item.lootId} className={styles.lootElement} draggable={true}
                            onDragStart={(e) => handleDragStart(
                                e,
                                item,
                                DROP_ORIGIN_SELECTION
                            )} onClick={() => moveOneElement(
                                item,
                                disenchantLoot,
                                displayLoot,
                                setDisenchantLoot,
                                setDisplayLoot
                            )}>
                            <div className={styles.imageContainer}>
                                <PrettyImage
                                    className={styles.lootImage}
                                    imgProps={{
                                        src: Globals.PROXY_STATIC_PREFIX + item.tilePath,
                                        alt: '',
                                        loading: 'lazy'
                                    }}
                                />
                            </div>
                            <div className={styles.lootDescription} draggable={false}>
                                <br></br>
                                <span>{item.displayCategories}<br/></span>
                                <span>{Globals.getReadableLootCategoryName(item.type)}<br/></span>
                                <span>{item.itemDesc} x{item.count}<br></br></span>
                            </div>
                        </div>);


                    })
                }
            </div>
            <button onClick={() => {
                sendDisenchantLoot();
            }}>Disenchant
            </button>
            <button onClick={() => {
                sendRerollLoot();
            }}>Reroll
            </button>
            <button onClick={() => {
                sendOpenLoot();
            }}>Open (Only works for chests)
            </button>
            {
                awaitingDisenchant ? (
                    <LootFeedback response={latestResponse} dismiss={dismiss}/>
                ) : <></>
            }
        </div>
    );
}