import * as Globals from '../../Globals';
import styles from '../../styles/PersistentMenu/BugReporter.module.css';
import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export interface BugReporterProps {
    svgClassName?: string;
}

export default function BugReporter({svgClassName}: BugReporterProps) {

    const [showModal, setShowModal] = useState(false);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalShow = () => {
        setShowModal(true);
    };

    const openGitHub = () => {
        window.open(
            Globals.GITHUB_ISSUES_URL,
            '_blank'
        );
        handleModalClose();
    };

    return (
        <>
            <svg className={Globals.applyMultipleStyles(svgClassName ?? '', styles.bugReportButton)}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432.458 432.458" onClick={() => {handleModalShow()}}>
                <g>
                    <path
                        d="M322.743,106.629c-2.778-4.518-5.731-8.889-8.873-13.08c-25.777-34.375-60.453-53.307-97.641-53.307   s-71.864,18.932-97.641,53.307c-3.143,4.191-6.095,8.562-8.874,13.08c20.061,31.973,60.275,53.85,106.514,53.85   C262.469,160.479,302.683,138.602,322.743,106.629z"/>
                    <path
                        d="M417.458,201.755h-65.606c-0.808-12.567-2.625-24.87-5.406-36.742l51.575-51.576   c5.858-5.858,5.858-15.355,0-21.213c-5.857-5.858-15.355-5.858-21.213,0l-25.966,25.966c-7.348,12.845-17.202,24.674-29.365,35.028   c-24.637,20.972-56.246,33.718-90.248,36.621v202.376c31.443-4.39,60.365-22.55,82.641-52.255   c3.907-5.21,7.536-10.687,10.881-16.395l52.058,52.058c2.929,2.929,6.768,4.393,10.607,4.393c3.838,0,7.678-1.465,10.606-4.393   c5.858-5.858,5.858-15.355,0-21.213l-59.579-59.58c7.427-19.594,11.986-40.927,13.41-63.076h65.606c8.284,0,15-6.716,15-15   C432.458,208.471,425.742,201.755,417.458,201.755z"/>
                    <path
                        d="M201.23,189.84c-34.003-2.903-65.612-15.649-90.249-36.621c-12.163-10.354-22.017-22.183-29.365-35.028   L55.65,92.224c-5.858-5.858-15.356-5.858-21.213,0c-5.858,5.858-5.858,15.355,0,21.213l51.575,51.575   c-2.78,11.873-4.598,24.175-5.406,36.742H15c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h65.606   c1.424,22.149,5.983,43.482,13.41,63.076l-59.579,59.579c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.858,15.355,5.858,21.213,0   l52.058-52.058c3.345,5.708,6.974,11.185,10.881,16.395c22.274,29.705,51.197,47.866,82.641,52.255V189.84z"/>
                </g>
            </svg>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Report a Bug</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Something isn't working as expected? Do you have suggestions for improvements? <br/>
                    Feel free to open a ticket on my GitHub page! <br/>
                    <br/>
                    You are using: <i>Poro-Client {Globals.VERSION_LONG}</i>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={openGitHub}>
                        Continue to GitHub
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}