import {Task, TaskArgument, TaskType} from '../ContainerTasks';
import {useEffect, useState} from 'react';
import CustomInput from './TaskDisplay/CustomInput';
import * as Globals from '../../../../Globals';
import axios from 'axios';


export interface TaskDisplayArgs {
    taskName: string;
}

interface TaskArgumentMap {
    [key: string]: any | undefined;
}

const setDefaultValues = (taskArgument: TaskArgument, argumentMap: TaskArgumentMap) => {
    switch (taskArgument.type) {
        case TaskType.NUMBER:
            argumentMap[taskArgument.backendKey] = 0;
            break;
        case TaskType.CHECKBOX:
            argumentMap[taskArgument.backendKey] = false;
            break;
        case TaskType.TEXT:
            argumentMap[taskArgument.backendKey] = '';
            break;
        case TaskType.SELECT:
        case TaskType.CHAMPION_SELECT:
        case TaskType.OWNED_CHAMPION_SELECT:
            argumentMap[taskArgument.backendKey] = -1;
            break;
        default:
            argumentMap[taskArgument.backendKey] = undefined;
            break;
    }
};

const setArgumentValues = (taskArgument: TaskArgument, currentValues: Record<string, any>, argumentMap: TaskArgumentMap) => {
    if (currentValues[taskArgument.backendKey] == undefined) {
        setDefaultValues(
            taskArgument,
            argumentMap
        );
        return;
    }
    argumentMap[taskArgument.backendKey] = currentValues[taskArgument.backendKey];
};

const buildTaskArgumentMap = (task: Task | undefined): TaskArgumentMap | undefined => {
    if (task === undefined) {
        return undefined;
    }
    const argumentMap: TaskArgumentMap = {};
    console.log(
        'Current values present: ',
        !Globals.isEmptyObject(task.currentValues)
    );
    if (Globals.isEmptyObject(task.currentValues)) {
        task.arguments.forEach((argument) => {
            setDefaultValues(
                argument,
                argumentMap
            );
        });
    } else {
        task.arguments.forEach((argument) => {
            setArgumentValues(
                argument,
                task.currentValues,
                argumentMap
            );
        });
    }
    return argumentMap;
};

export default function TaskDisplay({taskName}: TaskDisplayArgs) {
    //Task Data is fetched once when the parent component is mounted
    //When this component is mounted, the task data provided by the parent may be stale
    const [currentTaskData, setCurrentTaskData] = useState<Task | undefined>(undefined);
    const [taskArguments, setTaskArguments] = useState<TaskArgumentMap | undefined>(buildTaskArgumentMap(currentTaskData));

    useEffect(
        () => {
            console.log('[Fetch] Task ' + taskName);
            axios.get(Globals.REST_V1_PREFIX + '/tasks/' + taskName)
                .then((response) => {
                    console.log('[Fetch] Task ' + taskName + ' - Done');
                    setCurrentTaskData(response.data as Task);
                    setTaskArguments(buildTaskArgumentMap(response.data as Task));
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        [taskName]
    );

    useEffect(
        () => {
            const newTaskArguments = buildTaskArgumentMap(currentTaskData);
            const previousTaskArguments = taskArguments;
            //Dont update the task arguments if the data is the same
            if (previousTaskArguments === undefined || newTaskArguments === undefined) {
                return;
            }
            let shouldUpdate = false;
            for (const key in newTaskArguments) {
                if (newTaskArguments[key] !== previousTaskArguments[key]) {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                setTaskArguments(newTaskArguments);
            }
        },
        [currentTaskData]
    );

    const isValidTaskArgumentData = (taskArguments: TaskArgumentMap | undefined): boolean => {
        if (taskArguments === undefined) {
            return false;
        }
        for (const key in taskArguments) {
            if (taskArguments[key] === undefined) {
                return false;
            }
        }
        return true;
    };

    const submitTask = () => {
        if (!isValidTaskArgumentData(taskArguments)) {
            console.error(
                'Invalid task argument data',
                taskArguments
            );
            return;
        }

        const currentArguments = taskArguments;
        if (currentTaskData?.running) {
            console.log('[Update]: Task ' + taskName);
            axios.put(
                Globals.REST_V1_PREFIX + '/tasks/' + taskName,
                currentArguments
            )
                .then((response) => {
                    setCurrentTaskData((data) => {
                        const newData = {
                            ...data, currentValues: currentArguments
                        };
                        return newData;
                    });
                    console.log('[Update]: Task ' + taskName + ' - Done');
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        }

        console.log('[Start]: Task ' + taskName);
        axios.post(
            Globals.REST_V1_PREFIX + '/tasks/' + taskName,
            currentArguments
        )
            .then((response) => {
                setCurrentTaskData((data) => {
                    const newData = {
                        ...data, running: true, currentValues: currentArguments
                    };

                    return newData;
                });
                console.log('[Start]: Task ' + taskName + ' - Done');
            })
            .catch((error) => {
                console.error(error);
            });

        return;
    };

    const stopTask = () => {
        console.log('[Stop]: Task ' + taskName);
        axios.delete(Globals.REST_V1_PREFIX + '/tasks/' + taskName)
            .then((response) => {
                console.log('[Stop]: Task ' + taskName + ' - Done');
                const taskData = currentTaskData;
                setCurrentTaskData({...currentTaskData, running: false, currentValues: {}});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const setValueData = (key: string, value: any) => {
        console.log('Setting value for ' + key + ' to ' + value);
        setTaskArguments((prev) => {
            if (prev === undefined) {
                return undefined;
            }
            const newArguments = {...prev};
            newArguments[key] = value;
            return newArguments;
        });
    };

    if (currentTaskData === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{currentTaskData?.name}</h2>
            <p>{currentTaskData.description}</p>
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}>
                {
                    taskArguments === undefined ? <p>Loading...</p> :
                        Object.values(currentTaskData.arguments).map((argument) => {

                            return (
                                <div key={argument.backendKey} style={{
                                    width: '50%',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <div style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        {argument.displayName}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <CustomInput
                                            argument={argument}
                                            setValueData={setValueData}
                                            currentValue={taskArguments?.[argument.backendKey]}
                                        />
                                    </div>
                                </div>

                            );
                        })
                }
            </div>
            <button onClick={() => {
                submitTask();
            }}>
                Submit
            </button>
            <button onClick={() => {
                stopTask();
            }}>
                Stop Task
            </button>
        </div>
    );
}