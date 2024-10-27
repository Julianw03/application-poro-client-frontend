import {TaskArgument, TaskType} from '../../ContainerTasks';
import ChampionSelector from './CustomInput/ChampionSelector';
import OwnedChampionSelector from './CustomInput/OwnedChampionSelector';
import {Checkbox, FormControl, InputLabel, Select} from '@mui/material';
import GenericSelector from './CustomInput/GenericSelector';


export interface CustomInputProps {
    setValueData: (key: string, value: any) => void;
    argument: TaskArgument;
    additionalData?: any;
    currentValue?: any;
}

export default function CustomInput(data: CustomInputProps) {
    switch (data.argument.type) {
        case TaskType.CHECKBOX:
            return (
                <Checkbox style={{
                    width: '100%',
                    height: '100%'
                }}
                defaultChecked={data.currentValue}
                onChange={(event) => data.setValueData(
                    data.argument.backendKey,
                    event.target.checked
                )}
                />
            );
        case TaskType.NUMBER:
            const minimum = data.argument.additionalData?.minimum;
            const maximum = data.argument.additionalData?.maximum;

            return (
                <input
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    type={'number'}
                    defaultValue={data.currentValue ? parseInt(data.currentValue) : 0}
                    onChange={(event) => data.setValueData(
                        data.argument.backendKey,
                        parseInt(event.target.value)
                    )}
                    min={minimum}
                    max={maximum}
                />
            );
        case TaskType.TEXT:
            const pattern = data.argument.additionalData?.pattern;

            return (

                <input
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    type={'text'}
                    defaultValue={data.currentValue ?? ''}
                    onChange={(event) => data.setValueData(
                        data.argument.backendKey,
                        event.target.value
                    )}
                    pattern={pattern}
                />
            );
        case TaskType.CHAMPION_SELECT:
            return (
                <ChampionSelector selectedChampionId={data.currentValue}
                    onSelect={(championId) => data.setValueData(
                        data.argument.backendKey,
                        championId
                    )}/>
            );
        case TaskType.OWNED_CHAMPION_SELECT:
            return (
                <OwnedChampionSelector
                    selectedChampionId={data.currentValue}
                    onSelect={(championId) => data.setValueData(
                        data.argument.backendKey,
                        championId
                    )}/>
            );
        case TaskType.SELECT:
            return <GenericSelector
                argument={data.argument}
                onSelect={(val) => data.setValueData(
                    data.argument.backendKey,
                    val
                )}
                selectedValue={data.currentValue}/>;
        default:
            return (
                <div>
                    {`Unsupported type: ${data.argument.type}`}
                </div>
            );
    }
}