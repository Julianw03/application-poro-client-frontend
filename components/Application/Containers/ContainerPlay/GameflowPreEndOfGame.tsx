import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import styles from '../../../../styles/Application/Containers/ContainerPlay/GameflowPreEndOfGame.module.css';
import HonorCard from './GameflowPreEndOfGame/HonorCard';
import {EOGHonorPlayer} from '../../../../types/Store';

export default function GameflowPreEndOfGame() {
    const honorEOGState = useSelector((state: AppState) => state.honorEOGState);

    if (honorEOGState === null) {
        return (<></>);
    }

    const gameId = honorEOGState?.gameId;
    const eligiblePlayers = honorEOGState?.eligibleAllies;

    const renderLoading = () => {
        return (
            <div>
                <p>
                    Loading...
                </p>
            </div>
        );
    };

    if (gameId === undefined || eligiblePlayers === undefined) {
        return renderLoading();
    }

    const renderPlayer = (player: EOGHonorPlayer) => {
        return (
            <HonorCard player={player} gameId={gameId}/>
        );
    };


    return (
        <div className={styles.mainContainer}>
            <div className={styles.honorContainer}>
                {
                    eligiblePlayers.map((player) => {
                        if (player === undefined) {
                            return (<></>);
                        }
                        return (
                            <div key={player.puuid}>
                                {renderPlayer(player)}
                            </div>
                        );
                    })
                }
            </div>
            <div className={styles.skipContainer}>
                Skip Test
            </div>
        </div>
    );
}