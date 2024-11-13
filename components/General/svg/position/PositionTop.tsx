import {GenericPositionProps} from './Position';

export interface PositionTopProps extends GenericPositionProps {}

export default function PositionTop({color, highlightColor, className}: PositionTopProps) {
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            viewBox={'0 0 34 34'}
            className={className ?? ''}
        >
            <path
                opacity={0.5}
                fill={color ?? '#785a28'}
                fillRule={'evenodd'}
                d={'M21,14H14v7h7V14Zm5-3V26L11.014,26l-4,4H30V7.016Z'}
            />
            <polygon
                fill={highlightColor ?? '#c8aa6e'}
                points={'4 4 4.003 28.045 9 23 9 9 23 9 28.045 4.003 4 4'}
            />
        </svg>
    );
}