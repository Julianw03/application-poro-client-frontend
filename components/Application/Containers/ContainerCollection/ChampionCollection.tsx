import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import {MinimalChampion} from '../../../../types/Store';
import * as Globals from '../../../../Globals';
import styles from '../../../../styles/Application/Containers/ContainerCollection/ChampionCollection.module.css';
import PrettyImage from '../../../General/PrettyImage';

export default function ChampionCollection() {

    const MAX_CHAMPIONS_PER_ROW = 6;

    const champions = useSelector((state: AppState) => state.champions);
    const ownedChampions = useSelector((state: AppState) => state.ownedChampions);

    const skins = useSelector((state: AppState) => state.skins);

    if (champions === null || ownedChampions === null || skins === null) {
        return (<></>);
    }

    const renderRow = (
        championsToRender: (MinimalChampion | undefined)[]
    ) => {
        if (championsToRender === undefined) {
            return (<></>);
        }
        if ((championsToRender.length % MAX_CHAMPIONS_PER_ROW) !== 0) {
            const fillerCount = MAX_CHAMPIONS_PER_ROW - (championsToRender.length % MAX_CHAMPIONS_PER_ROW);
            for (let i = 0; i < fillerCount; i++) {
                championsToRender.push(undefined);
            }
        }

        const getClass = (
            championId: number
        ) => {
            const owned = ownedChampions[championId] !== undefined;
            if (owned) {
                return '';
            }

            return styles.unownedImage;
        };

        const isStrawberryChampion = (champion: MinimalChampion) => {
            return (champion.id > 3000);
        };

        return championsToRender
            .filter((champion) => {
                if (champion === undefined) {
                    return false;
                }
                return (!isStrawberryChampion(champion));
            })
            .map((champion, index) => {
                if (champion === undefined) {
                    return (
                        <div key={'Filler-' + index} style={{
                            width: 90 / MAX_CHAMPIONS_PER_ROW + 'vw'
                        }} className={styles.championCard + ' ' + styles.filler}>

                        </div>
                    );
                } else {
                    const championId = champion.id;
                    const championName = champion.name;
                    const roles = champion.roles;

                    const skinId = championId * 1000;

                    if (championId === -1) {
                        return (<></>);
                    }

                    return (
                        <div className={styles.championCard} style={{
                            width: 90 / MAX_CHAMPIONS_PER_ROW + 'vw'
                        }} key={champion.id}>
                            <div className={styles.championImageContainer + ' ' + getClass(championId)}>
                                <PrettyImage imgProps={{
                                    src: `${Globals.PROXY_STATIC_PREFIX}${skins[skinId]?.loadScreenPath}`,
                                    loading: 'lazy'
                                }}
                                useLoader={true}
                                className={styles.coverImage}
                                />
                            </div>
                            <div className={styles.championInfoContainer}>
                                <div className={styles.hiddenChampionNameContainer}>
                                    {championName}
                                </div>
                                <div className={styles.championNameContainer}>
                                    {championName}
                                </div>
                                <div className={styles.championRolesContainer}>
                                    {roles.map((role) => {
                                        return (
                                            <div
                                                className={styles.roleContainer}
                                                key={championId + '-' + role}
                                                title={role}>
                                                <PrettyImage
                                                    imgProps={{
                                                        src: Globals.STATIC_PREFIX + '/assets/png/roles/' + role + '.png',
                                                        fetchPriority: 'high'
                                                    }}
                                                    useLoader={true}
                                                    className={styles.containImage}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }
            });
    };

    const renderChampions = (champions: MinimalChampion[]) => {
        if (champions === undefined) {
            return (<></>);
        }
        const result = [];
        for (let i = 0; i < champions.length; i += MAX_CHAMPIONS_PER_ROW) {
            const championsToRender = champions.slice(
                i,
                i + MAX_CHAMPIONS_PER_ROW
            );
            result.push(renderRow(championsToRender));
        }
        return result;
    };

    return (
        <div className={styles.championContainer}>
            {
                renderChampions(
                    Object.values(champions)
                        .filter((champion) => {
                            return champion.id !== -1;
                        })
                        .sort((a, b) => {
                            return a.name.localeCompare(b.name);
                        })
                )
            }
        </div>
    );
}