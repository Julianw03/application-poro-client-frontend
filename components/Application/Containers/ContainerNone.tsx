import {useDispatch} from 'react-redux';
import * as Globals from '../../../Globals';
import styles from '../../../styles/Application/Containers/ContainerNone.module.css';
import {ContainerState} from '../../../types/Store';
import {ACTION_SET_ACTIVE_CONTAINER} from '../../../store';

export default function ContainerNone() {
    const dispatch = useDispatch();

    const changeContainer = (newContainer: ContainerState): void => {
        dispatch(
            ACTION_SET_ACTIVE_CONTAINER(newContainer)
        );
    };

    return (
        <div className={styles.selectContainer}>
            <div className={Globals.applyMultipleStyles(
                styles.selectElement,
                styles.selectElementPlay
            )} onClick={() => {
                changeContainer(ContainerState.PLAY);
            }}>
                PLAY
            </div>
            <div className={styles.selectElement} onClick={() => {
                changeContainer(ContainerState.COLLECTION);
            }}>
                Collection
            </div>
            <div className={styles.selectElement} onClick={() => {
                changeContainer(ContainerState.LOOT);
            }}>
                Loot
            </div>
            <div className={styles.selectElement} onClick={() => {
                changeContainer(ContainerState.PROFILE);
            }}>
                Profile
            </div>
            <div className={styles.selectElement} onClick={() => {
                changeContainer(ContainerState.TASKS);
            }}>
                Tasks
            </div>
            <div className={styles.selectElement} onClick={() => {
                changeContainer(ContainerState.CONFIG);
            }}>
                Configuration
            </div>

        </div>
    );
}