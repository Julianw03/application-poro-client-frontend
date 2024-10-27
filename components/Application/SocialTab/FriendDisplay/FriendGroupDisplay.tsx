import {useState} from 'react';
import {Friend, FriendGroup} from '../../../../types/Store';
import SingleFriendDisplay from './SingleFriendDisplay';
import styles from '../../../../styles/Application/SocialTab/FriendDisplay/FriendGroupDisplay.module.css';
import * as Globals from '../../../../Globals';

interface FriendGroupDisplayProps {
    friendGroup?: FriendGroup;
    friends: Friend[];
}

export default function FriendGroupDisplay({friendGroup, friends}: FriendGroupDisplayProps) {
    const [collapsed, setCollapsed] = useState(false);

    const friendCount = friends?.length;

    const onlineFriendCount = friends?.filter((friend) => friend.availability && friend.availability !== 'offline').length;

    const sortAlphabetically = (friend1: Friend, friend2: Friend) => {
        if (friend1.gameName < friend2.gameName) {
            return -1;
        } else if (friend1.gameName > friend2.gameName) {
            return 1;
        } else {
            return 0;
        }
    };

    const sortByAvailability = (friend1: Friend, friend2: Friend) => {
        const availabilityOrder = Globals.AVAILABILITY_ORDER;
        const friend1Index = availabilityOrder.indexOf(friend1.availability);
        const friend2Index = availabilityOrder.indexOf(friend2.availability);

        if (friend1Index === friend2Index) {
            return sortAlphabetically(
                friend1,
                friend2
            );
        }

        if (friend1Index < friend2Index) {
            return -1;
        }
        if (friend1Index > friend2Index) {
            return 1;
        }

        return sortAlphabetically(
            friend1,
            friend2
        );
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            <div className={styles.groupHeaderContainer}>
                <div className={styles.shortFlex}>
                    {onlineFriendCount} / {friendCount}
                </div>
                <div className={styles.longFlex}>
                    <div className={styles.nameContainer}>
                        {friendGroup?.name === '**Default' ? 'GENERAL' : friendGroup?.name?.toUpperCase()}
                    </div>
                    <div className={styles.arrowContainer} onClick={toggleCollapsed}>
                        <svg className={Globals.applyMultipleStyles(
                            styles.arrow,
                            collapsed ? styles.collapsedArrow : ''
                        )} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
                                  fill="#ffffff"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className={Globals.applyMultipleStyles(
                styles.friendsContainer,
                collapsed ? styles.collapsedFriends : ''
            )}>
                {
                    friends?.sort(
                        (friend1, friend2) => sortByAvailability(
                            friend1,
                            friend2
                        )
                    ).map((friend) => {
                        return <SingleFriendDisplay friend={friend} key={friend.id}/>;
                    })
                }
            </div>
        </div>
    );
}