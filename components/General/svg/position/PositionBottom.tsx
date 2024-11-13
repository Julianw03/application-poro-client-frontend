import {GenericPositionProps} from './Position';

export interface PositionBottomProps extends GenericPositionProps {
}

export default function PositionBottom({color, highlightColor, className}: PositionBottomProps) {
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
                d={'M13,20h7V13H13v7ZM4,4V26.984l3.955-4L8,8,22.986,8l4-4H4Z'}
            />
            <polygon
                fill={highlightColor ?? '#c8aa6e'}
                points={'29.997 5.955 25 11 25 25 11 25 5.955 29.997 30 30 29.997 5.955'}
            />
        </svg>
    );
}