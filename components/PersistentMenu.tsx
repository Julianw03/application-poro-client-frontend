import {useState} from 'react';
import styles from '../styles/PersistentMenu.module.css';
import * as Globals from '../Globals';
import ShutdownButton from './PersistentMenu/ShutdownButton';
import BugReporter from './PersistentMenu/BugReporter';

export default function PersistentMenu() {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={Globals.applyMultipleStyles(
            styles.container,
            collapsed ? styles.expanded : ''
        )}>
            <svg className={Globals.applyMultipleStyles(styles.singleSvgElement)} viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg" onClick={toggleCollapsed}>
                <path d="M3 6H21M3" className={Globals.applyMultipleStyles(
                    styles.bar,
                    collapsed ? styles.topBar : ''
                )}/>
                <path d="M3 12H21M3" className={Globals.applyMultipleStyles(
                    styles.bar,
                    collapsed ? styles.middleBar : ''
                )}/>
                <path d="M3 18H21" className={Globals.applyMultipleStyles(
                    styles.bar,
                    collapsed ? styles.bottomBar : ''
                )}/>
            </svg>
            {
                !collapsed ? <></> :
                    (
                        <>
                            <ShutdownButton svgClassName={styles.singleSvgElement}/>
                            <BugReporter svgClassName={styles.singleSvgElement}/>
                        </>)

            }
        </div>
    );
}