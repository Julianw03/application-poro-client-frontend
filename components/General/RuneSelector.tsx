import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../../styles/General/RuneSelector.module.css';

import * as Globals from '../../Globals';
import {number} from 'prop-types';
import macro from 'styled-jsx/macro';

export interface RuneSelectorProps {
    setVisible: (visible: boolean) => void;
}

interface PerkStyle {
    id: number;
    name: string;
    tooltip: string;
    iconPath: string;
    assetMap: Record<string, string>;
    isAdvanced: boolean;
    allowedSubStyleIds: number[];
    subStyleBonus: {
        styleId: number;
        perkId: number;
    }[];
    slots: {
        type: string;
        slotLabel: string;
        perks: number[];
    }[];
    defaultPageName: string;
    defaultSubStyle: number;
    defaultPerks: number[];
    defaultPerksWhenSplashed: number[];
    defaultStatModsPerSubStyle: {
        id: string,
        perks: number[]
    }[];
}

interface Perk {
    id: number;
    name: string;
    majorChangePatchVersion: string;
    tooltip: string;
    shortDesc: string;
    longDesc: string;
    recommendationDescriptor: string;
    iconPath: string;
    endOfGameStatDescs: string[];
    recommendationDescriptorAttibutes: Record<string, any>[];
}

export default function RuneSelector({setVisible}: RuneSelectorProps) {
    const [availableRunes, setAvailableRunes] = useState({} as Record<string, PerkStyle>);
    const [runePath, setRunePath] = useState({} as Record<string, Perk>);

    const [selectedRuneType, setSelectedRuneType] = useState(undefined as number | undefined);
    const [selectedSecondaryRuneType, setSelectedSecondaryRuneType] = useState(undefined as number | undefined);


    const [selectedKeyStoneId, setSelectedKeyStoneId] = useState(undefined as number | undefined);
    const [selectedPrimarySubRuneId1, setSelectedPrimarySubRuneId1] = useState(undefined as number | undefined);
    const [selectedPrimarySubRuneId2, setSelectedPrimarySubRuneId2] = useState(undefined as number | undefined);
    const [selectedPrimarySubRuneId3, setSelectedPrimarySubRuneId3] = useState(undefined as number | undefined);

    const [selectedSecondarySubRunes, setSelectedSecondarySubRunes] = useState([] as number[]);
    const [selectedSecondarySubRuneGroup, setSelectedSecondarySubRuneGroup] = useState([] as string[]);

    const [selectedStatModOne, setSelectedStatModOne] = useState(undefined as number | undefined);
    const [selectedStatModTwo, setSelectedStatModTwo] = useState(undefined as number | undefined);
    const [selectedStatModThree, setSelectedStatModThree] = useState(undefined as number | undefined);

    const clearSelectedSecondaryRunes = () => {
        setSelectedSecondarySubRunes([]);
        setSelectedSecondarySubRuneGroup([]);
    };

    const clearSecondaryRuneType = () => {
        setSelectedSecondaryRuneType(undefined);
    };

    const clearPrimaryRuneSelection = () => {
        setSelectedKeyStoneId(undefined);
        setSelectedPrimarySubRuneId1(undefined);
        setSelectedPrimarySubRuneId2(undefined);
        setSelectedPrimarySubRuneId3(undefined);
    };

    useEffect(
        () => {
            axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/perkstyles.json').then(
                (response) => {
                    const data = response.data;
                    if (data.styles !== undefined) {
                        const runeTypeMap = {} as Record<number, PerkStyle>;
                        data.styles.forEach((runeType: PerkStyle) => {
                            runeTypeMap[runeType.id] = runeType;
                        });
                        setAvailableRunes(runeTypeMap);
                    }
                }
            ).catch((error) => {
                console.error(error);
            });

            axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/perks.json').then(
                (response) => {
                    const data = response.data;
                    if (data !== undefined) {
                        const runeIdInfoMap = {} as Record<string, Perk>;
                        data.forEach((rune: Perk) => {
                            runeIdInfoMap[rune.id] = rune;
                        });
                        setRunePath(runeIdInfoMap);
                    }
                }
            ).catch((error) => {
                console.error(error);
            });
        },
        []
    );

    useEffect(
        () => {
            if (selectedRuneType === selectedSecondaryRuneType) {
                clearSelectedSecondaryRunes();
                clearSecondaryRuneType();
            }
            clearPrimaryRuneSelection();
        },
        [selectedRuneType]
    );

    const saveRunes = () => {
        if (selectedRuneType === undefined) {
            return;
        }
        if (selectedKeyStoneId === undefined) {
            return;
        }
        if (selectedPrimarySubRuneId1 === undefined) {
            return;
        }
        if (selectedPrimarySubRuneId2 === undefined) {
            return;
        }
        if (selectedPrimarySubRuneId3 === undefined) {
            return;
        }
        if (selectedSecondarySubRunes.length !== 2) {
            return;
        }
        if (selectedSecondarySubRunes[0] === undefined) {
            return;
        }
        if (selectedSecondarySubRunes[1] === undefined) {
            return;
        }
        if (selectedStatModOne === undefined) {
            return;
        }
        if (selectedStatModTwo === undefined) {
            return;
        }
        if (selectedStatModThree === undefined) {
            return;
        }
        console.log('SAVING RUNES, CONDITIONS MET');
        const sendObject = {
            name: 'Poro-Client: ' + runePath[selectedKeyStoneId].name,
            primaryStyleId: selectedRuneType,
            subStyleId: selectedSecondaryRuneType,
            selectedPerkIds: [selectedKeyStoneId, selectedPrimarySubRuneId1, selectedPrimarySubRuneId2, selectedPrimarySubRuneId3, selectedSecondarySubRunes[0], selectedSecondarySubRunes[1], selectedStatModOne, selectedStatModTwo, selectedStatModThree],
            current: true
        };
        axios.post(
            Globals.REST_V1_PREFIX + '/runes/save',
            sendObject
        ).then((response) => {
            console.log(response);
        });
    };

    const handleOutsideClick = () => {
        setVisible?.(false);
    };

    const renderPrimaryRune = () => {
        if (selectedRuneType === undefined) {
            return <></>;
        }
        const runeType = availableRunes[selectedRuneType];

        if (runeType === undefined) {
            return <></>;
        }

        const runeKeystoneIds = runeType.slots[0].perks;
        const subRuneIdsOne = runeType.slots[1].perks;
        const subRuneIdsTwo = runeType.slots[2].perks;
        const subRuneIdsThree = runeType.slots[3].perks;

        return (
            <>
                <div className={styles.keyStoneContainer}>
                    {
                        runeKeystoneIds.map((runeId, index) => {
                            return (
                                <div
                                    className={selectedKeyStoneId === runeId ? styles.singleKeyStoneContainerActive : styles.singleKeyStoneContainer}
                                    key={'keystone-' + index}>
                                    <div className={styles.singleKeyStoneImageContainer} title={runePath[runeId]?.name}
                                         onClick={() => {
                                             setSelectedKeyStoneId(runeId);
                                         }}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleKeyStoneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.subRuneContainer}>
                    {
                        subRuneIdsOne.map((runeId, index) => {
                            return (
                                <div
                                    className={(selectedPrimarySubRuneId1 === runeId) ? styles.singleSubRuneContainerActive : styles.singleSubRuneContainer}
                                    key={'subRuneOne-' + index} title={runePath[runeId]?.name} onClick={() => {
                                    setSelectedPrimarySubRuneId1(runeId);
                                }}>
                                    <div className={styles.singleSubRuneImageContainer}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleSubRuneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.subRuneContainer}>
                    {
                        subRuneIdsTwo.map((runeId, index) => {
                            return (
                                <div
                                    className={(selectedPrimarySubRuneId2 === runeId) ? styles.singleSubRuneContainerActive : styles.singleSubRuneContainer}
                                    key={'subRuneOne-' + index} title={runePath[runeId]?.name} onClick={() => {
                                    setSelectedPrimarySubRuneId2(runeId);
                                }}>
                                    <div className={styles.singleSubRuneImageContainer}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleSubRuneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.subRuneContainer}>
                    {
                        subRuneIdsThree.map((runeId, index) => {
                            return (
                                <div
                                    className={(selectedPrimarySubRuneId3 === runeId) ? styles.singleSubRuneContainerActive : styles.singleSubRuneContainer}
                                    key={'subRuneOne-' + index} title={runePath[runeId]?.name}>
                                    <div className={styles.singleSubRuneImageContainer} onClick={() => {
                                        setSelectedPrimarySubRuneId3(runeId);
                                    }}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleSubRuneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </>
        );
    };

    const doNothing = () => {
    };

    const renderSecondaryRuneTypes = () => {
        return Object.values(availableRunes).filter((runeType) => {
            return (runeType.id !== selectedRuneType);
        }).map((runeType, index) => {
            return (
                <div key={'secondaryRuneType-' + index}
                     className={selectedSecondaryRuneType === runeType.id ? styles.singleSecondaryRuneTypeContainerActive : styles.singleSecondaryRuneTypeContainer}
                     onClick={() => {
                         selectedSecondaryRuneType === runeType.id ? doNothing() : setSelectedSecondaryRuneType(runeType.id);
                     }}>
                    <div className={styles.singleSecondaryRuneTypeHeader}>
                        {runeType.name}
                    </div>
                    <div className={styles.singleSecondaryRuneTypeImageContainer}>
                        <img draggable={false} src={Globals.PROXY_PREFIX + runeType.iconPath} alt={'Loading'}
                             className={styles.singleSecondaryRuneTypeImage}></img>
                    </div>
                </div>
            );
        });
    };

    const renderSecondarySubRunes = (secondaryRuneType: any) => {
        if (secondaryRuneType === undefined) {
            return (<></>);
        }


        //TODO: Not scalable, make this better
        const runeType = availableRunes[secondaryRuneType];

        if (runeType === undefined) {
            return (<></>);
        }

        const subRuneIdsOneGroup = runeType.slots[1].slotLabel;
        const subRuneIdsTwoGroup = runeType.slots[2].slotLabel;
        const subRuneIdsThreeGroup = runeType.slots[3].slotLabel;

        const subRuneIdsOne = runeType.slots[1].perks;
        const subRuneIdsTwo = runeType.slots[2].perks;
        const subRuneIdsThree = runeType.slots[3].perks;

        const handleSubRuneChange = (runeId: number, slotLabel: string) => {
            if (selectedSecondarySubRunes.includes(runeId)) {
                return;
            }
            if (selectedSecondarySubRuneGroup.includes(slotLabel)) {
                console.log('TWO OF SAME TYPE');
                const newSelectedSecondarySubRunes = [...selectedSecondarySubRunes];
                newSelectedSecondarySubRunes[selectedSecondarySubRuneGroup.indexOf(slotLabel)] = runeId;
                setSelectedSecondarySubRunes(newSelectedSecondarySubRunes);
                return;
            }
            if (selectedSecondarySubRunes.length < 2) {
                setSelectedSecondarySubRuneGroup([...selectedSecondarySubRuneGroup, slotLabel]);
                setSelectedSecondarySubRunes([...selectedSecondarySubRunes, runeId]);
            } else {
                if (selectedSecondarySubRunes.includes(runeId)) {
                    return;
                }
                const newSelectedSecondarySubRuneGroup = [...selectedSecondarySubRuneGroup];
                const newSelectedSecondarySubRunes = [...selectedSecondarySubRunes];
                newSelectedSecondarySubRuneGroup.shift();
                newSelectedSecondarySubRunes.shift();
                newSelectedSecondarySubRuneGroup.push(slotLabel);
                newSelectedSecondarySubRunes.push(runeId);
                setSelectedSecondarySubRuneGroup(newSelectedSecondarySubRuneGroup);
                setSelectedSecondarySubRunes(newSelectedSecondarySubRunes);
            }
        };

        const checkIfActive = (runeId: number) => {
            if (selectedSecondarySubRunes[0] === runeId || selectedSecondarySubRunes[1] === runeId) {
                return true;
            }
            return false;
        };

        return (
            <>
                <div className={styles.secondarySubRuneContainer}>
                    {
                        subRuneIdsOne.map((runeId) => {
                            return (
                                <div
                                    className={checkIfActive(runeId) ? styles.singleSecondarySubRuneContainerActive : styles.singleSecondarySubRuneContainer}
                                    key={'subRuneOne-' + runeId} title={runePath[runeId]?.name}>
                                    <div className={styles.singleSecondarySubRuneImageContainer} onClick={() => {
                                        handleSubRuneChange(
                                            runeId,
                                            subRuneIdsOneGroup
                                        );
                                    }}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleSecondarySubRuneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.secondarySubRuneContainer}>
                    {
                        subRuneIdsTwo.map((runeId) => {
                            return (
                                <div
                                    className={checkIfActive(runeId) ? styles.singleSecondarySubRuneContainerActive : styles.singleSecondarySubRuneContainer}
                                    key={'subRuneOne-' + runeId} title={runePath[runeId]?.name}>
                                    <div className={styles.singleSecondarySubRuneImageContainer} onClick={() => {
                                        handleSubRuneChange(
                                            runeId,
                                            subRuneIdsTwoGroup
                                        );
                                    }}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleSecondarySubRuneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.secondarySubRuneContainer}>
                    {
                        subRuneIdsThree.map((runeId) => {
                            return (
                                <div
                                    className={checkIfActive(runeId) ? styles.singleSecondarySubRuneContainerActive : styles.singleSecondarySubRuneContainer}
                                    key={'subRuneOne-' + runeId} title={runePath[runeId]?.name}>
                                    <div className={styles.singleSecondarySubRuneImageContainer} onClick={() => {
                                        handleSubRuneChange(
                                            runeId,
                                            subRuneIdsThreeGroup
                                        );
                                    }}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleSecondarySubRuneImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>


            </>
        );

    };

    const renderStatMods = () => {
        if (selectedRuneType === undefined) {
            return (<></>);
        }

        const runeType = availableRunes[selectedRuneType];

        if (runeType === undefined) {
            return (<></>);
        }

        const statModOne = runeType.slots[4].perks;
        const statModTwo = runeType.slots[5].perks;
        const statModThree = runeType.slots[6].perks;


        return (
            <>
                <div className={styles.statModContainer}>
                    {
                        statModOne.map((runeId, index) => {
                            return (
                                <div
                                    className={selectedStatModOne === runeId ? styles.singleStatModContainerActive : styles.singleStatModContainer}
                                    key={'statModOne-' + index} title={runePath[runeId]?.name}>
                                    <div className={styles.singleStatModImageContainer}
                                         onClick={() => setSelectedStatModOne(runeId)}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleStatModImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.statModContainer}>
                    {
                        statModTwo.map((runeId, index) => {
                            return (
                                <div
                                    className={selectedStatModTwo === runeId ? styles.singleStatModContainerActive : styles.singleStatModContainer}
                                    key={'statModOne-' + index} title={runePath[runeId]?.name}>
                                    <div className={styles.singleStatModImageContainer}
                                         onClick={() => setSelectedStatModTwo(runeId)}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleStatModImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.statModContainer}>
                    {
                        statModThree.map((runeId, index) => {
                            return (
                                <div
                                    className={selectedStatModThree === runeId ? styles.singleStatModContainerActive : styles.singleStatModContainer}
                                    key={'statModOne-' + index} title={runePath[runeId]?.name}>
                                    <div className={styles.singleStatModImageContainer}
                                         onClick={() => setSelectedStatModThree(runeId)}>
                                        <img draggable={false}
                                             src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath}
                                             alt={'Loading'} className={styles.singleStatModImage}></img>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

            </>
        );

    };

    const renderSecondaryRunes = (secondaryRuneType: any) => {
        if (selectedRuneType === undefined) {
            return (<></>);
        }

        return (
            <>
                <div className={styles.saveButtonContainer}>
                    <button onClick={() => {
                        saveRunes();
                    }}>Save
                    </button>
                </div>
                <div className={styles.secondSite}>
                    <div className={styles.secondaryRuneTypeSelector}>
                        <div className={styles.secondaryRuneTypeFlex}>
                            {
                                renderSecondaryRuneTypes()
                            }
                        </div>
                    </div>

                    <div className={styles.secondaryRuneContainer}>
                        {
                            renderSecondarySubRunes(
                                secondaryRuneType
                            )
                        }
                    </div>
                    <div className={styles.subStyleContainer}>
                        {
                            renderStatMods()
                        }
                    </div>
                </div>
            </>

        );
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.backgroundFilter} onClick={() => {
                handleOutsideClick();
            }}>
            </div>
            {
                Globals.isEmptyObject(availableRunes) && Globals.isEmptyObject(runePath) ? <></> :
                    <div className={styles.runesContainer}>
                        <div className={styles.runesPrimaryContainer}>
                            <div className={styles.runeTypeSelector}>
                                <div className={styles.runesTypeFlex}>
                                    {
                                        Object.values(availableRunes).map((runeType, index) => {
                                            return (
                                                <div key={'runeType-' + index}
                                                     className={selectedRuneType === runeType.id ? styles.singleRuneTypeContainerActive : styles.singleRuneTypeContainer}
                                                     onClick={() => {
                                                         setSelectedRuneType(runeType.id);
                                                     }}>
                                                    <div className={styles.singleRuneTypeHeader}>
                                                        {runeType.name}
                                                    </div>
                                                    <div className={styles.singleRuneTypeImageContainer}>
                                                        <img draggable={false}
                                                             src={Globals.PROXY_PREFIX + runeType.iconPath}
                                                             alt={'Loading'}
                                                             className={styles.singleRuneTypeImage}></img>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className={styles.primaryRuneContainer}>
                                {
                                    renderPrimaryRune()
                                }
                            </div>
                        </div>
                        <div className={styles.runesSecondaryContainer}>
                            {
                                renderSecondaryRunes(
                                    selectedSecondaryRuneType
                                )
                            }
                        </div>
                    </div>
            }
        </div>
    );
}
