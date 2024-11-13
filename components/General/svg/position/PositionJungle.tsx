import {GenericPositionProps} from './Position';

export interface PositionJungleProps extends GenericPositionProps {
}

export default function PositionJungle({color, highlightColor, className}: PositionJungleProps) {
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            viewBox={'0 0 34 34'}
            className={className ?? ''}
        >
            <path
                fill={highlightColor ?? '#c8aa6e'}
                fillRule={'evenodd'}
                d={'M25,3c-2.128,3.3-5.147,6.851-6.966,11.469A42.373,42.373,0,0,1,20,20a27.7,27.7,0,0,1,1-3C21,12.023,22.856,8.277,25,3ZM13,20c-1.488-4.487-4.76-6.966-9-9,3.868,3.136,4.422,7.52,5,12l3.743,3.312C14.215,27.917,16.527,30.451,17,31c4.555-9.445-3.366-20.8-8-28C11.67,9.573,13.717,13.342,13,20Zm8,5a15.271,15.271,0,0,1,0,2l4-4c0.578-4.48,1.132-8.864,5-12C24.712,13.537,22.134,18.854,21,25Z'}
            />
        </svg>
    );
}