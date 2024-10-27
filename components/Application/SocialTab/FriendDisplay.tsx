import styles from '../../../styles/Application/SocialTab/FriendDisplay.module.css';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {Friend, FriendGroup} from '../../../types/Store';
import FriendGroupDisplay from './FriendDisplay/FriendGroupDisplay';
import {useEffect, useState} from 'react';

export default function FriendDisplay() {

    const MOBILE_FRIENDGROUP_ID = 10000 as number;
    const OFFLINE_FRIENDGROUP_ID = 10001 as number;
    const LEAGUE_FRIENDGROUP_ID = 20000 as number;

    const friends = useSelector((state: AppState) => state.friends);
    const friendGroups = useSelector((state: AppState) => state.friendGroups);

    if (!friends || !friendGroups) {
        return <></>;
    }

    const [friendByGroup, setFriendByGroup] = useState<Record<number, Friend[]>>({});

    useEffect(
        () => {
            // We will create a map where the key is the group id and the value is the friend array with that group id
            setFriendByGroup(Object.values(friends).reduce(
                (acc, friend) => {
                    if (friend === undefined) {
                        return acc;
                    }
                    if (acc[friend.groupId] === undefined) {
                        acc[friend.groupId] = [];
                    }
                    acc[friend.groupId].push(friend);
                    return acc;
                },
                {} as { [key: number]: Friend[] }
            ));

        },
        [friendGroups, friends]
    );

    return (
        <>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerIconContainer}>
                        <svg className={styles.headerIcon} preserveAspectRatio="xMidYMid meet" viewBox="-2 -2 24 24"
                            xmlns="http://www.w3.org/2000/svg" strokeWidth="0.75" stroke="#ffffff" fill="none"
                            transform="scale(-1 1)">
                            <g strokeWidth="0"/>
                            <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.128"/>
                            <g>
                                <path cx="22.83" cy="22.57" r="7.51"
                                    d="M9.481 7.053A2.347 2.347 0 0 1 7.134 9.4A2.347 2.347 0 0 1 4.787 7.053A2.347 2.347 0 0 1 9.481 7.053z"/>
                                <path d="M11.875 15.606a4.75 4.75 0 0 0 -4.753 -4.75 4.75 4.75 0 0 0 -4.75 4.75Z"/>
                                <path cx="44.13" cy="27.22" r="6.05"
                                    d="M15.681 8.506A1.891 1.891 0 0 1 13.791 10.397A1.891 1.891 0 0 1 11.9 8.506A1.891 1.891 0 0 1 15.681 8.506z"/>
                                <path
                                    d="M13.25 15.606h4.375A3.825 3.825 0 0 0 13.791 11.781a3.813 3.813 0 0 0 -1.797 0.447"/>
                            </g>
                        </svg>
                    </div>
                    <div className={styles.headerTextContainer}>
                        Friends
                    </div>
                </div>
            </div>

            <div className={styles.friendTab}>
                {
                    Object.entries(friendGroups)
                        .filter(([groupId, group]) => {
                            if (group === undefined) return false;
                            if (group.id == LEAGUE_FRIENDGROUP_ID) return false;
                            if (group.id == MOBILE_FRIENDGROUP_ID) return false;
                            return group.id != OFFLINE_FRIENDGROUP_ID;
                        })
                        .sort(
                            ([, group1], [, group2]) => group2.priority - group1.priority
                        ).map(([groupId, group]) => {
                            return <FriendGroupDisplay friendGroup={group} friends={friendByGroup[parseInt(groupId)]}
                                key={groupId}/>;
                        })
                }
            </div>
        </>
    );
}