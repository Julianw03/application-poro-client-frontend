import React from 'react';
import styles from '../../styles/General/ClickableText.module.css';

interface CopyToClipboardProps {
    text: string;
    children: React.ReactNode;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({text, children}) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(text).then(() => {

        }).catch((error) => {
            console.log(
                'Error copying to clipboard: ',
                error
            );
        });
    };

    return (
        <div onClick={() => {
            copyToClipboard();
        }} className={styles.body}>
            {children}
        </div>
    );
};

export default CopyToClipboard;