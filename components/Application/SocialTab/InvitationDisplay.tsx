import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import styles from '../../../styles/Application/SocialTab/InvitationDisplay.module.css';
import * as Globals from '../../../Globals';
import PrettyImage from '../../General/PrettyImage';
import {Color} from '../../../types/Color';
import axios from 'axios';
import {Invitation} from '../../../types/Store';

export default function InvitationDisplay() {

    const invitations = useSelector((state: AppState) => state.invitations);

    const mapAssets = useSelector((state: AppState) => state.mapAssets);

    const queues = useSelector((state: AppState) => state.queues);

    if (invitations === null || mapAssets === null || queues === null) {
        return <></>;
    }

    if (invitations.length === 0) {
        return <></>;
    }

    const acceptInvitation = (invitation: Invitation) => {
        if (!invitation.canAcceptInvitation) {
            return;
        }
        axios.post(Globals.PROXY_PREFIX + '/lol-lobby/v2/received-invitations/' + invitation.invitationId + '/accept')
            .then(() => {
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const declineInvitation = (invitationId: string) => {
        axios.post(Globals.PROXY_PREFIX + '/lol-lobby/v2/received-invitations/' + invitationId + '/decline')
            .then(() => {
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const renderInvitation = () => {
        return invitations.map((invitation) => {

            if (invitation.state === 'Declined') {
                return <div key={invitation.invitationId}></div>;
            }

            return (
                <div key={invitation.invitationId} className={styles.singleInvitation}>
                    <div className={styles.inviteIconContainer}>
                        <PrettyImage imgProps={{
                            className: styles.headerIcon,
                            src: invitation.canAcceptInvitation ?
                                Globals.getGameSelectIconActive(
                                    mapAssets,
                                    invitation.gameConfig?.mapId,
                                    invitation.gameConfig?.gameMode
                                ) :
                                Globals.getGameSelectDefault(
                                    mapAssets,
                                    invitation.gameConfig?.mapId,
                                    invitation.gameConfig?.gameMode
                                )
                        }}/>
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.singleTextLine}>
                            <b>{(invitation.fromGameName ?? 'Unknown') + '#' + (invitation.fromTagLine ?? '')}</b>
                        </div>
                        <div className={styles.singleTextLine}>
                            {Globals.getMapInfo(
                                mapAssets,
                                invitation.gameConfig?.mapId,
                                invitation.gameConfig?.gameMode
                            )?.name}
                        </div>
                        <div className={styles.singleTextLine}>
                            {queues[invitation.gameConfig?.queueId]?.description}
                        </div>
                    </div>
                    <div className={styles.actionButtons}>
                        <div className={styles.acceptButtonContainer}>
                            <button className={Globals.applyMultipleStyles(
                                styles.acceptButton,
                                invitation.canAcceptInvitation ? '' : styles.acceptButtonUnavailable
                            )} onClick={() => {
                                acceptInvitation(invitation);
                            }}>
                                <svg viewBox="0 0 1024 1024" version="1.1" className={styles.acceptIconClass}
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M866.133333 258.133333L362.666667 761.6l-204.8-204.8L98.133333 618.666667 362.666667 881.066667l563.2-563.2z"/>
                                </svg>
                            </button>
                        </div>
                        <div className={styles.declineButtonContainer}>
                            <button className={styles.declineButton} onClick={() => {
                                declineInvitation(invitation.invitationId);
                            }}>
                                <svg viewBox="0 0 100 100" version="1.1" className={styles.declineIconClass}
                                     xmlns="http://www.w3.org/2000/svg">
                                    <line x1="30" y1="30" x2="70" y2="70" className={styles.declineIconStrokes}/>
                                    <line x1="70" y1="30" x2="30" y2="70" className={styles.declineIconStrokes}/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div>
            <div className={styles.headerContainer}>
                <div className={styles.headerIconContainer}>
                    <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 10V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V10M3 10L12 14L21 10M3 10L7 7M21 10L17 7M7 11.7778V5C7 4.44772 7.44772 4 8 4H16C16.5523 4 17 4.44772 17 5V11.7778"
                            stroke="#FAFAFA" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </div>
                <div className={styles.headerTextContainer}>
                    Invitations ({invitations.length})
                </div>
            </div>
            <div className={Globals.applyMultipleStyles(styles.invitationContainer)}>
                {
                    renderInvitation()
                }
            </div>
        </div>
    );
}