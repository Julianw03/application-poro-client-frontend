import {useSelector} from 'react-redux';
import {AppState} from '../../../../../../store';
import * as Globals from '../../../../../../Globals';
import {Avatar, Icon, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, Select} from '@mui/material';
import PrettyImage from '../../../../../General/PrettyImage';

export interface ChampionSelectorProps {
    onSelect: (championId: number) => void;
    selectedChampionId?: number;
}

export default function ChampionSelector(data: ChampionSelectorProps) {
    const champions = useSelector((state: AppState) => state.champions);
    const skins = useSelector((state: AppState) => state.skins);

    const onSelect = (championId: number) => {
        if (data.onSelect) {
            data.onSelect(championId);
        }
    };

    return (
        <div style={{backgroundColor: 'white'}}>
            <Select style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent'
            }} defaultValue={data.selectedChampionId ?? -1}>
                <MenuItem value={-1} key={'unselected'} disabled={true}>
                    <div style={{
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            Select a champion
                        </div>
                    </div>
                </MenuItem>
                {
                    Object
                        .values(champions)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((champion) => {
                            return (
                                <MenuItem value={champion.id} key={champion.id} onClick={() => {
                                    onSelect(champion.id);
                                }}>
                                    <div style={{
                                        backgroundColor: 'transparent',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <div style={{
                                            flex: 1,
                                            aspectRatio: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                height: '80%',
                                                width: '80%'
                                            }}>
                                                <PrettyImage imgProps={{
                                                    src: Globals.PROXY_STATIC_PREFIX + skins[champion.id * 1000].tilePath,
                                                    style: {objectFit: 'contain', width: '100%'}
                                                }}/>
                                            </div>
                                        </div>
                                        <div style={{
                                            flex: 5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {champion.name}
                                        </div>
                                    </div>
                                </MenuItem>
                            );
                        })
                }
            </Select>
        </div>
    );
}