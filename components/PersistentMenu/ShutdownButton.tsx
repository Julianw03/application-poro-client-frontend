import styles from '../../styles/PersistentMenu/ShutdownButton.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import * as Globals from '../../Globals';
enum ShutdonwOptions {
    SHUTDOWN_ALL = 'shutdown-all',
    SHUTDOWN_PORO_CLIENT = 'shutdown',
}

export interface ShutdownButtonProps {
    svgClassName?: string;
}

export default function ShutdownButton({svgClassName}: ShutdownButtonProps) {

    const [showModal, setShowModal] = useState(false);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalShow = () => {
        setShowModal(true);
    };


    const shutdown = (option: ShutdonwOptions) => {
        axios.post(Globals.REST_PREFIX + '/shutdown',
            JSON.stringify({type: option}),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((response) => {
                console.log(response.data);
                window.close();
            })
            .catch((error) => {
                console.error(error);
            });
        handleModalClose();
    };


    return (
        <>
            <svg className={svgClassName} viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg" onClick={() => {
                handleModalShow();
            }}>
                <path
                    d="M12.0001 2V12M18.3601 6.64C19.6185 7.89879 20.4754 9.50244 20.8224 11.2482C21.1694 12.9939 20.991 14.8034 20.3098 16.4478C19.6285 18.0921 18.4749 19.4976 16.9949 20.4864C15.515 21.4752 13.775 22.0029 11.9951 22.0029C10.2152 22.0029 8.47527 21.4752 6.99529 20.4864C5.51532 19.4976 4.36176 18.0921 3.68049 16.4478C2.99921 14.8034 2.82081 12.9939 3.16784 11.2482C3.51487 9.50244 4.37174 7.89879 5.63012 6.64"
                    className={styles.powerButton}/>
            </svg>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shutdown</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    What shutdown option do you want to use?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'secondary'} onClick={() => {
                        shutdown(ShutdonwOptions.SHUTDOWN_PORO_CLIENT);
                    }}>
                        Poro-Client
                    </Button>
                    <Button variant={'primary'} onClick={() => {
                        shutdown(ShutdonwOptions.SHUTDOWN_ALL);
                    }}>
                        Poro-Client & League Client
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}