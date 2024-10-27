import {Queue} from '../../../../../../types/Store';
import styles
    from '../../../../../../styles/Application/Containers/ContainerPlay/GameflowNone/GamemodeSelector/GamemodeElement.module.css';
import {CSSProperties, useEffect} from 'react';
import * as Globals from '../../../../../../Globals';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../../../store';
import PrettyVideo from '../../../../../General/PrettyVideo';
import PrettyImage from '../../../../../General/PrettyImage';
import {getGameSelectDefault} from '../../../../../../Globals';


export interface GamemodeElementProps {
    gamemode: string,
    queues: Queue[],
    active: boolean
    setActive: (gamemode: string) => void
    activeQueueId: number
    setActiveQueueId: (queueId: number) => void
}

export default function GamemodeElement(data: GamemodeElementProps) {

    const mapAssets = useSelector((state: AppState) => state.mapAssets);

    useEffect(
        () => {
            if (data.active) {
                data.setActiveQueueId(data.queues[0].id);
            }
        },
        [data.active]
    );

    const renderIcon = (gameMode: string, active: boolean) => {
        const videoStyle = {
            margin: 0,
            height: '50%',
            width: '50%',
            objectFit: 'contain',
            overflow: 'hidden'
        } as CSSProperties;
        const imgContainerStyle = {
            margin: 0,
            height: '47%',
            width: '47%',
            objectFit: 'contain',
            overflow: 'hidden'
        } as CSSProperties;
        const imageStyle = {
            margin: 0,
            height: '100%',
            width: '100%',
            objectFit: 'contain',
            overflow: 'hidden'
        } as CSSProperties;
        if (active) {
            videoStyle['display'] = 'block';
            imgContainerStyle['display'] = 'none';
        } else {
            videoStyle['display'] = 'none';
            imgContainerStyle['display'] = 'block';
        }

        return (
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <PrettyVideo videoProps={{
                    src: Globals.getGameSelectVideoActive(
                        mapAssets,
                        data.queues[0].mapId,
                        gameMode
                    ),
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    style: videoStyle
                }}
                />
                <div style={imgContainerStyle} onClick={() => data.setActive(data.gamemode)}>
                    <PrettyImage imgProps={
                        {
                            src: Globals.getGameSelectDefault(
                                mapAssets,
                                data.queues[0].mapId,
                                gameMode
                            ),
                            style: imageStyle
                        }
                    }/>
                </div>
            </div>
        );
    };

    const getCategoryName = (queue: Queue, gameMode: string) => {
        const assetForMap = mapAssets[queue.mapId];
        if (!assetForMap) {
            return '';
        }
        const assetForGameMode = assetForMap[gameMode];
        if (!assetForGameMode) {
            return '';
        }

        return assetForGameMode.gameModeName;
    };

    return (
        <div className={styles.container}>
            <div className={styles.upperArea}>
                <div className={styles.upperIconArea}>
                    {
                        renderIcon(
                            data.gamemode,
                            data.active
                        )
                    }
                </div>
                <div className={styles.upperTextArea}>
                    <div>
                        {
                            getCategoryName(
                                data.queues[0],
                                data.gamemode
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={styles.lowerArea}>
                {
                    data.active ?
                        <div className={styles.queueSelection}>
                            {data.queues
                                .sort((a, b) => a.id - b.id)
                                .map((queue) => {
                                    return (
                                        <div className={Globals.applyMultipleStyles(
                                            styles.queueButton,
                                            data.activeQueueId === queue.id ? styles.active : ''
                                        )} key={queue.id} onClick={() => data.setActiveQueueId(queue.id)}>
                                            {queue.description}
                                        </div>
                                    );
                                })}
                        </div>
                        :
                        <>
                        </>

                }
            </div>
        </div>
    );
}