import GamemodeSelector from './GameflowNone/GamemodeSelector';
import styles from '../../../../styles/Application/Containers/ContainerPlay/GameflowNone.module.css';

export default function GameflowNone() {
    return (
        <div className={styles.container}>
            <GamemodeSelector onClosed={() => {
            }}/>
        </div>
    );
}