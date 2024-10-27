import {DragType, Friend, GenericDragAndDropData} from '../../../../types/Store';
import styles from '../../../../styles/Application/SocialTab/FriendDisplay/SingleFriend.module.css';
import * as Globals from '../../../../Globals';
import PrettyImage from '../../../General/PrettyImage';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Tooltip} from 'react-bootstrap';
import FriendToolTip from './FriendToolTip';
import {useState} from 'react';


interface SingleFriendDisplayProps {
    friend: Friend;
}

export default function SingleFriendDisplay({friend}: SingleFriendDisplayProps) {

    const [dragging, setDragging] = useState(false);

    if (friend.gameName == friend.puuid) {
        return (
            <></>
        );
    }

    const getActivityClassName = (availability: string): string => {
        switch (availability) {
            case 'online':
            case 'chat':
                return styles.chat;
            case 'dnd':
                return styles.dnd;
            case 'away':
                return styles.away;
            case 'mobile':
            case 'offline':
            default:
                return styles.offline;
        }
    };

    const getActivityString = () => {
        const availability = friend?.availability;
        const gameStatus = friend?.lol?.gameStatus;

        return Globals.getActivityFromCombinedActivity(
            availability,
            gameStatus,
            friend.productName
        );
    };

    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.clearData();
        setDragging(true);
        const friendDragData = {
            key: DragType.FRIEND,
            data: friend
        } as GenericDragAndDropData;
        e.dataTransfer.setData(
            'text/plain',
            JSON.stringify(friendDragData)
        );
    };

    const onDragEnd = () => {
        setDragging(false);
    };

    const renderOverlay = () => {
        return (

            dragging ?
                <></>
                :
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
                    <FriendToolTip friend={friend}/>
                </Tooltip>
        );
    };

    return (
        <OverlayTrigger overlay={renderOverlay()} placement={'left'} delay={{show: 400, hide: 100}}>
            <div className={styles.container} draggable={true}
                 style={dragging ? {cursor: 'grabbing'} : {}}
                 onDragStart={(e) => {
                     onDragStart(e);
                 }} onDragEnd={() => {
                onDragEnd();
            }}>
                <div className={styles.shortFlex}>
                    <div className={styles.profileIconContainer}>
                        {friend.iconId ?
                            <PrettyImage
                                useLoader={true}
                                imgProps={{
                                    src: Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + friend.iconId + '.jpg',
                                    className: styles.profileIcon
                                }}
                            />
                            :
                            <></>}
                        <div className={Globals.applyMultipleStyles(
                            styles.activityDiv,
                            getActivityClassName(friend?.availability)
                        )}>

                        </div>
                    </div>
                </div>
                <div className={styles.longFlex}>
                    <div className={styles.gameNameContainer}>
                        {friend.gameName}
                    </div>
                    <div className={styles.activityDescription}>
                        <>
                            {
                                getActivityString()
                            }
                        </>
                    </div>
                    <div className={styles.spacer}/>
                </div>
            </div>
        </OverlayTrigger>
    );
}