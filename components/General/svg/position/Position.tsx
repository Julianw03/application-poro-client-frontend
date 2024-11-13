import PositionTop from './PositionTop';
import PositionSupport from './PositionSupport';
import PositionJungle from './PositionJungle';
import PositionBottom from './PositionBottom';
import PositionMiddle from './PositionMiddle';

export interface GenericPositionProps {
    color?: string;
    highlightColor?: string;
    className?: string;
}

export enum Position {
    TOP = 'TOP',
    MIDDLE = 'MIDDLE',
    BOTTOM = 'BOTTOM',
    JUNGLE = 'JUNGLE',
    UTILITY = 'UTILITY'
}

export interface PositionProps {
    position?: Position;
    genericProps: GenericPositionProps;
}

export default function GenericPosition({position, genericProps}: PositionProps) {

    const getDefault = () => {
        return (
            <div className={genericProps.className ?? ''}>
                {position}
            </div>
        );
    };

    if (!position) {
        return getDefault();
    }

    switch (position) {
        case Position.TOP:
            return <PositionTop {...genericProps}/>;
        case Position.MIDDLE:
            return <PositionMiddle {...genericProps}/>;
        case Position.BOTTOM:
            return <PositionBottom {...genericProps}/>;
        case Position.JUNGLE:
            return <PositionJungle {...genericProps}/>;
        case Position.UTILITY:
            return <PositionSupport {...genericProps}/>;
        default:
            return getDefault();
    }
}