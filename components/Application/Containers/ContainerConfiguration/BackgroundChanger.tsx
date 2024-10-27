import {SyntheticEvent, useEffect, useState} from 'react';
import styles from '../../../../styles/Application/Containers/ContainerConfiguration/BackgroundChanger.module.css';
import {BackgroundInfo, ClientBackgroundType} from '../../../DynamicBackground';
import * as Globals from '../../../../Globals';
import axios from 'axios';
import PrettyImage from '../../../General/PrettyImage';
import PrettyVideo from '../../../General/PrettyVideo';

const BackgroundTypeToText = (bgType: ClientBackgroundType) => {
    switch (bgType) {
        case ClientBackgroundType.LOCAL_IMAGE:
            return 'Local Image';
        case ClientBackgroundType.LOCAL_VIDEO:
            return 'Local Video';
        case ClientBackgroundType.LCU_IMAGE:
            return 'LCU Image';
        case ClientBackgroundType.LCU_VIDEO:
            return 'LCU Video';
        case ClientBackgroundType.NONE:
            return 'None';
        default:
            return 'Unknown';
    }
};


export default function BackgroundChanger() {

    const [currentBackgroundInfo, setCurrentBackgroundInfo] = useState<BackgroundInfo | undefined>(undefined);

    const [selectedType, setSelectedType] = useState<ClientBackgroundType>(ClientBackgroundType.NONE);
    const [selectedBackground, setSelectedBackground] = useState<string>('');

    const [fileURL, setFileURL] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const setTypesFromBackgroundInfo = (bgInfo: BackgroundInfo) => {
        setSelectedType(bgInfo.backgroundType);
        setSelectedBackground(bgInfo.background);
    };

    const fetchBackgrounInfo = () => {
        axios.get(Globals.REST_PREFIX + '/config/background/info')
            .then((response) => {
                console.log(response.data);
                const backgroundInfo: BackgroundInfo = response.data as BackgroundInfo;
                setCurrentBackgroundInfo(backgroundInfo);
                setTypesFromBackgroundInfo(backgroundInfo);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    useEffect(
        () => {
            fetchBackgrounInfo();
        },
        []
    );

    useEffect(
        () => {
            if (selectedFile) {
                const url = URL.createObjectURL(selectedFile);
                setFileURL(url);

                // Release object URL on cleanup
                return () => {
                    URL.revokeObjectURL(url);
                };
            }
        },
        [selectedFile]
    );

    const handleTypeSelection = (event: SyntheticEvent<HTMLSelectElement>) => {
        setSelectedType(event.currentTarget.value as ClientBackgroundType);
    };

    const renderTypeSelection = (bgInfo: BackgroundInfo) => {
        console.log(bgInfo?.backgroundType);
        return (
            <div className={styles.typeSelectionContainer}>
                Select Background Type: &nbsp;
                <select defaultValue={bgInfo?.backgroundType} key={bgInfo?.backgroundType}
                    onChange={event => handleTypeSelection(event)}>
                    {
                        Object.keys(ClientBackgroundType).map((key) => {

                            const type = ClientBackgroundType[key as keyof typeof ClientBackgroundType];
                            console.log(type);
                            return (
                                <option key={type}
                                    value={type}>
                                    {BackgroundTypeToText(type)}
                                </option>
                            );
                        })
                    }
                </select>
            </div>

        );
    };

    const renderBackgroundSelection = () => {
        if (selectedType === ClientBackgroundType.NONE || selectedType === ClientBackgroundType.LOCAL_IMAGE || selectedType === ClientBackgroundType.LOCAL_VIDEO) {
            return <></>;
        }

        return (<div className={styles.backgroundSelectionContainer}>
            Ressource Path: <input type="text" value={selectedBackground}
                onChange={(event) => setSelectedBackground(event.currentTarget.value)}/>
        </div>);
    };

    const renderPreview = () => {
        const blobUrl = fileURL ? fileURL : '';

        switch (selectedType) {
            case ClientBackgroundType.LOCAL_IMAGE:
                return (
                    <PrettyImage className={styles.mediaContainer} imgProps={{src: blobUrl}}/>
                );
            case ClientBackgroundType.LCU_IMAGE:
                return (
                    <PrettyImage key={selectedBackground} className={styles.mediaContainer}
                        imgProps={{src: Globals.PROXY_PREFIX + selectedBackground}}/>
                );
            case ClientBackgroundType.LOCAL_VIDEO:
                return (
                    <PrettyVideo
                        videoProps={{
                            autoPlay: true,
                            muted: true,
                            loop: true,
                            src: blobUrl,
                            disablePictureInPicture: true
                        }}
                        key={fileURL}
                        className={styles.mediaContainer}>
                    </PrettyVideo>
                );
            case ClientBackgroundType.LCU_VIDEO:
                return (
                    <PrettyVideo key={selectedBackground}
                        videoProps={{
                            autoPlay: true,
                            muted: true,
                            loop: true,
                            disablePictureInPicture: true,
                            src: Globals.PROXY_PREFIX + selectedBackground
                        }}
                        className={styles.mediaContainer}
                    >
                    </PrettyVideo>
                );
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append(
                'file',
                selectedFile
            );

            const xhr = new XMLHttpRequest();
            xhr.open(
                'POST',
                Globals.REST_PREFIX + '/config/background/upload',
                true
            );
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log('Upload successful!');
                } else if (xhr.readyState === 4) {
                    console.error(
                        'Upload failed: ',
                        xhr.status,
                        xhr.statusText
                    );
                }
            };
            xhr.send(formData);
        }
    };

    const handleConfigUpload = () => {
        axios.post(
            Globals.REST_PREFIX + '/config/background',
            {
                backgroundType: selectedType,
                background: selectedBackground
            }
        ).then(() => {
            console.log('Config upload successful');
        }).catch((error) => {
            console.error(
                'Config upload failed: ',
                error
            );
        });
    };

    const renderBackgroundUploader = () => {

        switch (selectedType) {
            case ClientBackgroundType.LOCAL_IMAGE:
            case ClientBackgroundType.LOCAL_VIDEO:
                return (
                    <div>
                        <input type="file" onChange={handleFileChange}/>
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                );
            case ClientBackgroundType.LCU_IMAGE:
            case ClientBackgroundType.LCU_VIDEO:
                return (
                    <div>
                        <button onClick={handleConfigUpload}>Upload</button>
                    </div>
                );
            case ClientBackgroundType.NONE:
            default:
                return <></>;
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                Background Changer
            </div>
            <div className={styles.content}>
                <div className={styles.settingsSection}>
                    {renderTypeSelection(currentBackgroundInfo)}
                    {renderBackgroundSelection()}
                    {
                        renderBackgroundUploader()
                    }
                </div>
                <div className={styles.previewSection}>
                    <div className={styles.previewContainer}>
                        {renderPreview()}
                    </div>
                </div>
            </div>
        </div>
    );
}