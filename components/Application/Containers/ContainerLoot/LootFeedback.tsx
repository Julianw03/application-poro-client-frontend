import {LootItem} from '../../../../types/Store';
import styles from '../../../../styles/Application/Containers/ContainerLoot/LootFeedback.module.css';
import * as Globals from '../../../../Globals';
import PrettyImage from '../../../General/PrettyImage';

export interface LootResponse {
    message: string,
    details: {
        added: {
            deltaCount: number,
            playerLoot: LootItem
        }[],
        redeemed: {
            deltaCount: number,
            playerLoot: LootItem
        }[],
        removed: {
            deltaCount: number,
            playerLoot: LootItem
        }[]
    }
}

export interface ErrorResponse {
    error: string;
    details?: string;
}

export interface LootFeedbackProps {
    response: ErrorResponse | LootResponse | undefined;
    dismiss: () => void;
}

export default function LootFeedback(
    props: LootFeedbackProps
) {

    const resetResponse = () => {
        if (props.dismiss) {
            props.dismiss();
        }
    };

    const renderContent = (response: ErrorResponse | LootResponse | undefined) => {
        if (response === undefined) {
            return (<>No response</>);
        }


        if (!Object.hasOwn(
            response,
            'error'
        )) {
            const lootResponse = response as LootResponse;
            return (
                <div className={styles.wrapper}>
                    <div className={styles.responseMessageContainer}>
                        <h1>{lootResponse.message}!</h1>
                    </div>
                    <div className={styles.responseDisplayContainer}>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Removed</div>
                            <div className={styles.lootContainer}>
                                {lootResponse.details.removed.map((item) => (


                                    <div key={item.playerLoot.lootId} className={styles.lootElement}>
                                        <div className={styles.lootIconWrapper}>
                                            <PrettyImage imgProps={
                                                {
                                                    className: styles.lootIcon,
                                                    src: Globals.getTilePathUrl(item.playerLoot),
                                                    alt: ''
                                                }
                                            }/>
                                            <div className={styles.countContainer}>
                                                <div className={styles.countBubble}>
                                                    {Globals.getPrettyCount(item.deltaCount)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.lootDescription}>
                                            {item.deltaCount}x {Globals.getReadableLootName(item.playerLoot)}<br/>
                                            {Globals.getReadableLootCategoryName(item.playerLoot.type)}<br/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Added</div>
                            <div className={styles.lootContainer}>
                                {lootResponse.details.added.map((item) => {
                                    return (
                                        <div key={item.playerLoot.lootId} className={styles.lootElement}>
                                            <div className={styles.lootIconWrapper}>
                                                <PrettyImage imgProps={
                                                    {
                                                        className: styles.lootIcon,
                                                        src: Globals.getTilePathUrl(item.playerLoot),
                                                        alt: ''
                                                    }
                                                }/>
                                                <div className={styles.countContainer}>
                                                    <div className={styles.countBubble}>
                                                        {Globals.getPrettyCount(item.deltaCount)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.lootDescription}>
                                                {item.deltaCount}x {Globals.getReadableLootName(item.playerLoot)}<br/>
                                                {Globals.getReadableLootCategoryName(item.playerLoot.type)}<br/>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>Redeemed</div>
                            <div className={styles.lootContainer}>
                                {lootResponse.details.redeemed.map((item) => (
                                    <div key={item.playerLoot.lootId} className={styles.lootElement}>
                                        <div className={styles.lootIconWrapper}>
                                            <PrettyImage imgProps={
                                                {
                                                    className: styles.lootIcon,
                                                    src: Globals.getTilePathUrl(item.playerLoot),
                                                    alt: ''
                                                }
                                            }/>
                                            <div className={styles.countContainer}>
                                                <div className={styles.countBubble}>
                                                    {Globals.getPrettyCount(item.deltaCount)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.lootDescription}>
                                            {item.deltaCount}x {Globals.getReadableLootName(item.playerLoot)}<br/>
                                            {Globals.getReadableLootCategoryName(item.playerLoot.type)}<br/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={resetResponse}>Close</button>
                    </div>
                </div>
            );
        }

        const errorResponse = response as ErrorResponse;
        return (
            <div>
                <h1>{errorResponse.error}</h1>
                {errorResponse.details ? <p>{errorResponse.details}</p> : null}
                <button onClick={resetResponse}>Close</button>
            </div>
        );
    };

    const renderLoading = () => {
        return (
            <div className={styles.spinnerContainer}>
                <svg stroke={'#F0F0F0'} viewBox={'0 0 24 24'} className={styles.spinner}>
                    <circle cx={12} cy={12} r={9.5} fill={'none'} strokeWidth={3} className={styles.circle}/>
                </svg>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {props.response ? renderContent(props.response) : renderLoading()}
        </div>
    );
}