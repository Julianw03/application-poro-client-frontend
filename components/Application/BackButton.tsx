import {useDispatch, useSelector} from 'react-redux';
import {ACTION_SET_ACTIVE_CONTAINER, AppState} from '../../store';
import styles from '../../styles/Application/BackButton.module.css';
import {ContainerState} from '../../types/Store';

export default function BackButton() {

    const dispatch = useDispatch();
    const currentContainer = useSelector((state: AppState) => state.activeContainer);


    const changeContainer = () => {
        dispatch(
            ACTION_SET_ACTIVE_CONTAINER(
                ContainerState.NONE
            )
        );
    };

    const renderButton = () => {
        switch (currentContainer.container) {
            case ContainerState.NONE:
                return (
                    <></>
                );
            default:
                return (
                    <div className={styles.container} onClick={changeContainer}>
                        Back
                    </div>
                );
        }
    };

    return (
        renderButton()
    );
}