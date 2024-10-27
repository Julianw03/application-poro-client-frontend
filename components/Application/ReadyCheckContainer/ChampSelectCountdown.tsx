import {useEffect, useState} from 'react';

export interface ChampSelectCountdownProps {
    accepted: boolean;
    declined: boolean;
}

const COUNTDOWN_DURATION_SECONDS = 10;

export default function ChampSelectCountdown({accepted, declined}: ChampSelectCountdownProps) {

    const initialProgressPercent = 25;
    const pixels = 628.32;
    const pixelPerPercent = (-pixels / 100.0);

    const colorAccept = '#76e5b1';
    const colorDecline = '#e57676';

    const [color, setColor] = useState(colorAccept);

    useEffect(
        () => {
            if (declined) {
                setColor(colorDecline);
            }
        },
        [declined]
    );


    return (
        <>
            <svg viewBox="-125 -125 250 250" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(45deg)'}}
                 fill="transparent">
                <circle r="100" cx="0" cy="0" fill={'#181a1b'} stroke={color} strokeWidth="16px"
                        strokeDasharray={'628.32px'}
                        strokeDashoffset={(accepted || declined) ? (pixelPerPercent * initialProgressPercent) : ('-628.32px')}>
                    {(!(accepted || declined)) ? (
                        <animate attributeName="stroke-dashoffset"
                                 values={(pixelPerPercent * initialProgressPercent) + 'px;-628.32px'}
                                 dur={COUNTDOWN_DURATION_SECONDS + 's'}
                                 repeatCount="1"></animate>
                    ) : (
                        <></>
                    )}
                </circle>
            </svg>
        </>
    );
}