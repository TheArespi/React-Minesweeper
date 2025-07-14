import type { ReactNode } from "react";
import InformationIcon from "../assets/icons/InformationIcon";
import React from "react";
import SmileIcon from "../assets/icons/SmileIcon";
import FrownIcon from "../assets/icons/FrownIcon";

interface HeaderProps {
    title?: string;
    bombsFound: number;
    totalBombs: number;
    finished?: boolean;
    won?: boolean;
    onReset?: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
    const {title = "Minesweeper", bombsFound, totalBombs, finished = false, won = false, onReset} = props;

    const [ resetIcon, setResetIcon ] = React.useState<ReactNode>(<InformationIcon />);

    const onResetClicked = () => {
        if (finished && onReset)
            onReset();
    }

    React.useEffect(() => {
        if (finished) {
            if (won) 
                setResetIcon(<SmileIcon />);
            else
                setResetIcon(<FrownIcon />);
        } else {
            setResetIcon(<InformationIcon />);
        }
    }, [finished, won])

    return (
        <div className="flex justify-between items-center bg-gray-300 gap-2 p-4 rounded m-1.5">
            <div><h3 className="text-black font-bold">{title}</h3></div>
            <div className={`
                    aspect-square 
                    rounded-full 
                    bg-black 
                    p-0.5
                    ${finished ? 'hover:bg-gray-600' : ''}
                    ${finished ? 'cursor-pointer' : ''}
                `}
                onClick={onResetClicked}
            >{resetIcon}</div>
            <div className="">
                <h3 className="text-black font-bold">Bombs Found {bombsFound}/{totalBombs}</h3>
            </div>
        </div>
    )
}

export default Header;