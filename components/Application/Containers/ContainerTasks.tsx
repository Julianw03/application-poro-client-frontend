import {useEffect, useState} from 'react';
import styles from '../../../styles/Application/Containers/ContainerTasks.module.css';
import axios from 'axios';
import {REST_V1_PREFIX} from '../../../Globals';
import ChampionSelector from './ContainerTasks/TaskDisplay/CustomInput/ChampionSelector';
import OwnedChampionSelector from './ContainerTasks/TaskDisplay/CustomInput/OwnedChampionSelector';
import TaskDisplay from './ContainerTasks/TaskDisplay';


export enum TaskType {
    TEXT = 'TEXT',
    COLOR = 'COLOR',
    CHECKBOX = 'CHECKBOX',
    NUMBER = 'NUMBER',
    CHAMPION_SELECT = 'CHAMPION_SELECT',
    OWNED_CHAMPION_SELECT = 'OWNED_CHAMPION_SELECT',
    SELECT = 'SELECT',
}

export interface TaskArgument {
    displayName: string;
    backendKey: string;
    type: TaskType;
    required: boolean;
    description: string;
    additionalData?: any;
}

export interface Task {
    name: string;
    running: boolean;
    arguments: TaskArgument[];
    currentValues: Record<string, any>
    description: string;
}

interface TaskInfo {
    taskKey: string;
    name: string;
}

export default function ContainerTasks() {

    const [taskInfo, setTaskInfo] = useState<TaskInfo[] | undefined>(undefined);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number | undefined>(0);

    useEffect(
        () => {
            axios.get(REST_V1_PREFIX + '/tasks')
                .then((response) => {
                    setTaskInfo(response.data as TaskInfo[]);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        []
    );

    useEffect(
        () => {
            if (taskInfo === undefined) {
                return;
            }
            setActiveTaskIndex(0);
        },
        [taskInfo]
    );

    return (
        <div className={styles.container}>
            <li/>
            <li/>
            <li/>
            <li/>
            {
                (taskInfo === undefined) ? <p>Loading...</p> :
                    taskInfo.length === 0 ? <p>No tasks available</p> :
                        <>
                            <div>
                                {
                                    taskInfo.map((taskName, index) => {
                                        return (
                                            <button key={index}
                                                    onClick={() => setActiveTaskIndex(index)}>{taskName.name}</button>
                                        );
                                    })
                                }
                            </div>
                            <div>
                                <TaskDisplay taskName={taskInfo[activeTaskIndex].taskKey}/>
                            </div>
                        </>
            }
        </div>
    );
}