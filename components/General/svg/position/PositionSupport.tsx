import {GenericPositionProps} from './Position';

export interface PositionSupportProps extends GenericPositionProps {}

export default function PositionSupport({color, highlightColor, className}: PositionSupportProps) {
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            viewBox={'0 0 34 34'}
            className={className ?? ''}
        >
            <path
                className={'active'}
                fill={highlightColor ??'#c8aa6e'}
                fillRule={'evenodd'}
                d={'M26,13c3.535,0,8-4,8-4H23l-3,3,2,7,5-2-3-4h2ZM22,5L20.827,3H13.062L12,5l5,6Zm-5,9-1-1L13,28l4,3,4-3L18,13ZM11,9H0s4.465,4,8,4h2L7,17l5,2,2-7Z'}
            />
        </svg>
    );
}