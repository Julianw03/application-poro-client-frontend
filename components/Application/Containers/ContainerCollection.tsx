import ChampionCollection from './ContainerCollection/ChampionCollection';
import styles from '../../../styles/Application/Containers/ContainerCollection.module.css';


export default function ContainerCollection() {


    return (
        <div className={styles.container}>
            <div className={styles.containerSelectorContainer}>
            </div>
            <div className={styles.collectionWrapper}>
                <div className={styles.collectionTransitionTop}/>
                <div className={styles.collectionContainer}>
                    <ChampionCollection/>
                </div>
                <div className={styles.collectionTransitionBottom}/>
            </div>

        </div>
    );
}