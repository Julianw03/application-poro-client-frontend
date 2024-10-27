import {MenuItem, Select} from '@mui/material';
import {TaskArgument} from '../../../ContainerTasks';
import {useEffect} from 'react';

interface KeyValue {
    value: string;
    displayName: string;
}

interface SelectTaskArgument extends TaskArgument {
    additionalData: {
        options: KeyValue[];
    };
}

export interface GenericSelectorProps {
    argument: TaskArgument;
    onSelect: (value: string) => void;
    selectedValue?: string;
}

export default function GenericSelector(props: GenericSelectorProps) {

    const argument = props.argument as SelectTaskArgument;

    return (
        <Select style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
        }} defaultValue={props.selectedValue ?? -1}>
            <MenuItem value={-1} key={'unselected'} disabled={true}>
                        Select an option
            </MenuItem>
            {
                argument.additionalData.options.map((option) => {
                    return (
                        <MenuItem value={option.value} key={option.value} onClick={() => {
                            props.onSelect(option.value);
                        }}>
                            {option.displayName}
                        </MenuItem>
                    );
                })
            }
        </Select>);
}