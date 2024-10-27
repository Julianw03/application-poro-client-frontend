import * as Globals from '../../Globals';
import {AppState} from '../../store';
import {useSelector} from 'react-redux';

import styles from '../../styles/Application/ReadyCheckContainer.module.css';
import ChampSelectCountdown from './ReadyCheckContainer/ChampSelectCountdown';
import {useEffect, useState} from 'react';
import axios from 'axios';
import ReworkedMusicSystem, {DefaultSound} from '../Audio/ReworkedMusicSystem';

export default function ReadyCheckContainer() {
    const gameflow = useSelector((state: AppState) => state.gameflowState);


    useEffect(
        () => {
            ReworkedMusicSystem.getInstance().playDefaultSoundSFX(
                DefaultSound.READY_CHECK_APPEAR,
                0
            );
        },
        []
    );

    const [accept, setAccept] = useState(false);
    const [decline, setDecline] = useState(false);

    const buttonsDisabled = () => {
        return (accept || decline);
    };

    const acceptReadyCheck = () => {
        ReworkedMusicSystem.getInstance().playDefaultSoundSFX(
            DefaultSound.READY_CHECK_ACCEPT,
            0
        );
        axios.post(
            Globals.PROXY_PREFIX + '/lol-matchmaking/v1/ready-check/accept',
            ''
        );
        setAccept(true);
    };

    const declineReadyCheck = () => {
        ReworkedMusicSystem.getInstance().playDefaultSoundSFX(
            DefaultSound.READY_CHECK_DECLINE,
            0
        );
        axios.post(
            Globals.PROXY_PREFIX + '/lol-matchmaking/v1/ready-check/decline',
            ''
        );
        setDecline(true);
    };

    const renderAcceptState = () => {
        if (accept) {
            return (
                <div>
                    ACCEPTED!
                </div>
            );
        }
        if (decline) {
            return (
                <div>
                    DECLINED!
                </div>
            );
        }
        return (<> </>);
    };
    const renderReadyCheck = () => {
        return (
            <div className={styles.container}>
                <div className={styles.roundBackground}>
                    <ChampSelectCountdown accepted={accept} declined={decline}/>
                </div>
                <div className={styles.roundContainer}>
                    <div className={styles.internalContainer}>
                        <div className={styles.matchFoundContainer}>
                            MATCH FOUND
                        </div>
                        <div className={styles.acceptStateContainer}>
                            {
                                renderAcceptState()
                            }
                        </div>
                        <div className={styles.buttonContainer}>
                            <button className={styles.buttonAccept} onClick={acceptReadyCheck}
                                    disabled={buttonsDisabled()}>
                                ACCEPT!
                            </button>
                            <div className={styles.spacer}/>
                            <button className={styles.buttonDecline} onClick={declineReadyCheck}
                                    disabled={buttonsDisabled()}>
                                DECLINE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        renderReadyCheck()
    );

}