import styles from '../../../../../styles/Application/Containers/ContainerPlay/GameflowLobby/DefaultLobby.module.css';
import LobbyMemberCard from './LobbyMemberCard';
import {LobbyState} from '../../../../../types/Store';

export interface DefaultLobbyProps {
    lobby: LobbyState | null;
}

export default function DefaultLobby({lobby}: DefaultLobbyProps) {
    return (
        <div className={styles.member_container}>
            {
                lobby.members?.map(
                    (member, index) => {
                        const key = member.puuid ?? index;
                        return <LobbyMemberCard member={member} lobby={lobby} key={key}/>;
                    }
                )
            }
        </div>
    );
}