import {useSelector} from 'react-redux';
import {AppState} from '../../../../../store';
import * as Globals from '../../../../../Globals';
import {useEffect, useState} from 'react';
import {Queue} from '../../../../../types/Store';

import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowNone/GamemodeSelector.module.css';
import GamemodeElement from './GamemodeSelector/GamemodeElement';
import axios from 'axios';

interface OrderedQueue {
    PvP: {
        [key: string]: Queue[]
    },
    Tutorial: {
        [key: string]: Queue[]
    },
    VersusAi: {
        [key: string]: Queue[]
    }
}

enum QueueCategory {
    PvP = 'PvP',
    VersusAi = 'VersusAi',
    Tutorial = 'Tutorial'
}

const GamemodeUnknown = 5000;

const GamemodeOrdering: Record<string, number | undefined> = {
    'CLASSIC': 0,
    'ARAM': 1,
    'TFT': 99999999
};

interface GamemodeSelectorProps {
    onClosed: () => void;
}

export default function GamemodeSelector(props: GamemodeSelectorProps) {

    const defaultQueueCategory = QueueCategory.PvP;

    const defaultQueueId = -1;

    const queues = useSelector((state: AppState) => state.queues);
    const [orderedQueues, setOrderedQueues] = useState<undefined | OrderedQueue>(undefined);

    const [activeCategory, setActiveCategory] = useState<QueueCategory | undefined>(undefined);
    const [activeGameMode, setActiveGameMode] = useState<string>('');

    const [activeQueueId, setActiveQueueId] = useState<number>(defaultQueueId);

    if (queues === null) {
        return (<></>);
    }

    const getGamemodeOrdering = (gamemode: string) => {
        const order = GamemodeOrdering[gamemode];
        if (order === undefined) {
            return GamemodeUnknown;
        }

        return order;
    };

    useEffect(
        () => {
            setActiveCategory(defaultQueueCategory);
        },
        []
    );

    useEffect(
        () => {
            switch (activeCategory) {
                case QueueCategory.PvP:
                    setActiveGameMode(Object.keys(orderedQueues?.PvP ?? {})[0]);
                    break;
                case QueueCategory.Tutorial:
                    setActiveGameMode(Object.keys(orderedQueues?.Tutorial ?? {})[0]);
                    break;
                case QueueCategory.VersusAi:
                    setActiveGameMode(Object.keys(orderedQueues?.VersusAi ?? {})[0]);
                    break;
            }
        },
        [activeCategory]
    );

    useEffect(
        () => {
            const ordQueues = Object
                .values(queues)
                .filter(queue => queue.queueAvailability === 'Available')
                .reduce(
                    (acc: Record<string, Record<string, any>>, queue) => {
                        const category = queue.gameMode.startsWith('TUTORIAL_MODULE_') ? 'Tutorial' : queue.category;
                        const gameMode = queue.gameMode;

                        if (!acc[category]) {
                            acc[category] = {};
                        }

                        if (!acc[category][gameMode]) {
                            acc[category][gameMode] = [];
                        }

                        acc[category][gameMode].push(queue);

                        return acc;
                    },
                    {}
                );
            console.log(ordQueues);
            setOrderedQueues(ordQueues as unknown as OrderedQueue);
        },
        [queues]
    );

    const startLobby = (queueId: number) => {
        if (queueId === defaultQueueId) {
            return;
        }

        axios.post(
            Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby',
            {
                queueId: queueId
            }
        )
            .then((response) => {
                props.onClosed();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const renderSelection = (activeCategory: QueueCategory | undefined, ordQ: OrderedQueue | undefined) => {
        if (ordQ === undefined) {
            return (<></>);
        }

        if (activeCategory === undefined) {
            return (<></>);
        }

        const selection = ordQ[activeCategory];
        if (selection === undefined) {
            return (<></>);
        }

        return Object.entries(selection)
            .sort(([a, aQueues], [b, bQueues]) => {
                const aOrder = getGamemodeOrdering(a);
                const bOrder = getGamemodeOrdering(b);

                return aOrder - bOrder;
            }).map(([gameMode, queues]) => {
                return (
                    <GamemodeElement setActive={setActiveGameMode} key={gameMode} gamemode={gameMode} queues={queues}
                                     active={gameMode === activeGameMode} activeQueueId={activeQueueId}
                                     setActiveQueueId={setActiveQueueId}/>);
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.broadCategorySelectionArea}>
                {
                    Object.keys(QueueCategory).map((key) => {
                        return (
                            <button key={key}
                                    onClick={() => setActiveCategory(QueueCategory[key as keyof typeof QueueCategory])}>
                                {QueueCategory[key as keyof typeof QueueCategory]}
                            </button>
                        );
                    })
                }
            </div>
            <div className={styles.subCategorySelectionArea}>
                {
                    renderSelection(
                        activeCategory,
                        orderedQueues
                    )
                }
            </div>
            <button className={styles.cancelButton} onClick={() => {
                props.onClosed();
            }}>
                Cancel
            </button>
            <button className={styles.startButton} onClick={() => {
                startLobby(activeQueueId);
            }}>
                Confirm
            </button>
        </div>
    );
}