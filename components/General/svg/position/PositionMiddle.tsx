import {GenericPositionProps} from './Position';

export interface PositionMiddleProps extends GenericPositionProps {
}

export default function PositionMiddle({color, highlightColor, className}: PositionMiddleProps) {
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            viewBox={'0 0 34 34'}
            className={className ?? ''}
        >
            <path
                opacity={'0.5'}
                fill={color ?? '#785a28'}
                fillRule={'evenodd'}
                d={'M30,12.968l-4.008,4L26,26H17l-4,4H30ZM16.979,8L21,4H4V20.977L8,17,8,8h8.981Z'}
            />
            <polygon
                fill={highlightColor ?? '#c8aa6e'}
                points={'25 4 4 25 4 30 9 30 30 9 30 4 25 4'}
            />
        </svg>
    );
}