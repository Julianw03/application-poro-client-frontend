import {useSelector} from 'react-redux';
import {AppState} from '../store';
import * as Globals from '../Globals';
import styles from '../styles/Application.module.css';
import SocialTab from './Application/SocialTab';
import BackButton from './Application/BackButton';
import {ContainerState} from '../types/Store';
import ContainerNone from './Application/Containers/ContainerNone';
import ContainerPlay from './Application/Containers/ContainerPlay';
import ContainerProfile from './Application/Containers/ContainerProfile';
import ContainerLoot from './Application/Containers/ContainerLoot';
import ContainerTasks from './Application/Containers/ContainerTasks';
import ContainerCollection from './Application/Containers/ContainerCollection';
import ReadyCheckContainer from './Application/ReadyCheckContainer';
import ReworkedMusicSystem, {SoundReplacementPolicy, SoundScope} from './Audio/ReworkedMusicSystem';
import ContainerConfiguration from './Application/Containers/ContainerConfiguration';
import MusicManager from './MusicManager';

export default function Application() {

    const gameflowState = useSelector((state: AppState) => state.gameflowState);
    const activeContainer = useSelector((state: AppState) => state.activeContainer);

    const renderContainer = () => {
        switch (activeContainer.container) {
            case ContainerState.COLLECTION:
                return <ContainerCollection/>;
            case ContainerState.TASKS:
                return <ContainerTasks/>;
            case ContainerState.PLAY:
                return <ContainerPlay/>;
            case ContainerState.LOOT:
                return <ContainerLoot/>;
            case ContainerState.PROFILE:
                return <ContainerProfile/>;
            case ContainerState.CONFIG:
                return <ContainerConfiguration/>;
            case ContainerState.NONE:
            default:
                return <ContainerNone/>;
        }
    };

    const renderReadyCheck = () => {
        if (gameflowState !== null && gameflowState?.phase === Globals.GAMEFLOW_READY_CHECK) {
            return (
                <ReadyCheckContainer/>
            );
        }

        return <></>;
    };

    return (
        <div className={styles.container}>
            <BackButton/>
            <SocialTab/>
            {/*<ActivityReminder/>*/}
            <div className={styles.content}>
                {renderContainer()}
            </div>
            {
                renderReadyCheck()
            }
        </div>
    );
}