import * as Globals from '../Globals';
import {useSelector} from 'react-redux';
import {AppState} from '../store';
import {useEffect} from 'react';
import ReworkedMusicSystem, {DefaultSound, SoundScope} from './Audio/ReworkedMusicSystem';

export default function MusicManager() {
    const gameflow = useSelector((state: AppState) => state.gameflowState);

    useEffect(() => {
        if (!gameflow || !gameflow.phase) return;
        switch (gameflow.phase) {
            case Globals.GAMEFLOW_MATCHMAKING:
            case Globals.GAMEFLOW_READY_CHECK:
                ReworkedMusicSystem.getInstance().playDefaultSound(
                    SoundScope.GAMEFLOW_LOBBY_AMBIENT,
                    DefaultSound.GAMEFLOW_LOBBY_AMBIENT
                );
                break;
            case Globals.GAMEFLOW_NONE:
            case Globals.GAMEFLOW_LOBBY:
            default:
                ReworkedMusicSystem.getInstance().stopScope(
                    SoundScope.GAMEFLOW_LOBBY_AMBIENT
                );
                break;
        }

    }, [gameflow]);


    return <></>;
}