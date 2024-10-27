import {useEffect, useState} from 'react';

export interface PrettyTimerArgs {
    startTimestamp: string | undefined;
}

const getTimePretty = (startTimestamp: string | undefined) => {
    if (startTimestamp === undefined) {
        return '';
    }
    const start = new Date(parseInt(startTimestamp));
    const now = new Date();
    const diff = now.getTime() - start.getTime();

    const sec = Math.floor(diff / 1000);

    return renderSecondsPretty(sec);
};

const renderSecondsPretty = (passedSeconds: number) => {
    const secondsFixed = Math.round(passedSeconds);

    const seconds = secondsFixed % 60;
    const minutes = Math.floor(secondsFixed / 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function PrettyTimer(props: PrettyTimerArgs) {

    const [timePretty, setTimePretty] = useState<string>(getTimePretty(props.startTimestamp));

    useEffect(
        () => {
            const update = setInterval(
                () => {
                    setTimePretty(getTimePretty(props.startTimestamp));
                },
                1000
            );

            console.log('Starting interval');
            return () => {
                console.log('Clearing interval');
                clearInterval(update);
            };
        },
        []
    );

    return (<> {timePretty} </>);
}