import styles from '../../../styles/Application/SocialTab/ProfileDisplay.module.css';
import * as Globals from '../../../Globals';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PrettyImage from '../../General/PrettyImage';
import FriendToolTip from './FriendDisplay/FriendToolTip';
import {Friend, SocialAvailability} from '../../../types/Store';

export default function ProfileDisplay() {

    const selfPresence = useSelector((state: AppState) => state.selfPresence);
    const currentSummoner = useSelector((state: AppState) => state.currentSummoner);

    if (!selfPresence || !currentSummoner) {
        return <></>;
    }

    const profileIcon = selfPresence?.icon;
    const activity = selfPresence?.availability;
    const gameName = selfPresence?.gameName;
    const detailedActivity = selfPresence?.lol?.gameStatus;

    const level = currentSummoner?.summonerLevel;
    const xpTowardsNextLevel = currentSummoner?.xpUntilNextLevel;
    const xpSinceLastLevel = currentSummoner?.xpSinceLastLevel;
    const xpPercentage = currentSummoner?.percentCompleteForNextLevel;

    const renderLevelProgressBarTooltip = (percentage: number, currentXp: number, xpTowardsNextLevel: number) => (
        <Tooltip>
            {currentXp} / {xpTowardsNextLevel} XP ({percentage}%)
        </Tooltip>
    );

    const renderLevel = () => {
        if (!level || !xpTowardsNextLevel || !xpSinceLastLevel || !xpPercentage) {
            return <></>;
        }

        return (
            <OverlayTrigger overlay={renderLevelProgressBarTooltip(
                xpPercentage,
                xpSinceLastLevel,
                xpTowardsNextLevel
            )} placement={'bottom'} delay={{show: 250, hide: 400}}>
                <ProgressBar now={xpPercentage} style={{height: '0.7dvw', transform: 'translateY(-10%)'}}/>
            </OverlayTrigger>
        );
    };

    const getActivityClassName = (availability: string): string => {
        switch (availability) {
            case SocialAvailability.ONLINE:
            case SocialAvailability.CHAT:
                return styles.chat;
            case SocialAvailability.DND:
                return styles.dnd;
            case SocialAvailability.AWAY:
                return styles.away;
            case SocialAvailability.MOBILE:
            case SocialAvailability.OFFLINE:
            default:
                return styles.offline;
        }
    };

    const renderOverlay = () => {
        return (
            <Tooltip className={styles.test}>
                {
                    // We use this style tag to override the default tooltip styling
                }
                <style type={'text/css'}>
                    {`
                    
                      .tooltip {
                        --bs-tooltip-padding-x: 0;
                        --bs-tooltip-padding-y: 0;
                        --bs-tooltip-bg: #000000;
                        --bs-tooltip-opacity: 1;
                        --bs-tooltip-border-radius: 0;
                      }
                 
                    
                      .tooltip-inner { 
                        height: 100%;
                        width: 100%;
                        max-width: none;
                       }
                    `}
                </style>
                <FriendToolTip friend={selfPresence as unknown as Friend}/>
            </Tooltip>
        );
    };

    return (
        <OverlayTrigger overlay={renderOverlay()} placement={'left'} delay={{show: 400, hide: 100}}>
            <div className={styles.container}>
                <div className={styles.shortFlex}>
                    <div className={styles.profileIconContainer}>
                        {profileIcon ?
                            <PrettyImage
                                useLoader={true}
                                imgProps={{
                                    src: Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + profileIcon + '.jpg',
                                    alt: '',
                                    className: styles.profileIcon
                                }}
                            />
                            :
                            <></>}
                        <div className={Globals.applyMultipleStyles(
                            styles.activityDiv,
                            getActivityClassName(activity)
                        )}>
                        </div>
                    </div>
                </div>
                <div className={styles.longFlex}>
                    <div className={styles.gameNameContainer}>
                        {gameName}
                    </div>
                    <div className={styles.levelContainer}>
                        <div className={styles.levelText}>
                            {
                                level ? 'Level ' + level : ''
                            }
                        </div>
                        <div className={styles.renderLevelContainer}>
                            {
                                renderLevel()
                            }
                        </div>
                    </div>
                    <div className={styles.activityDescription}>
                        {
                            Globals.getActivityFromRemoteActivity(
                                detailedActivity,
                                ''
                            )
                        }
                    </div>
                </div>
            </div>
        </OverlayTrigger>
    );
}