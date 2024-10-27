import styles from '../../styles/Application/SocialTab.module.css';
import ProfileDisplay from './SocialTab/ProfileDisplay';
import InvitationDisplay from './SocialTab/InvitationDisplay';
import FriendDisplay from './SocialTab/FriendDisplay';
import QueueDisplay from './SocialTab/QueueDisplay';


export default function SocialTab() {
    return (
        <div className={styles.container}>
            <ProfileDisplay/>
            <QueueDisplay/>
            <InvitationDisplay/>
            <FriendDisplay/>
        </div>
    );
}