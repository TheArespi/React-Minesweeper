import React, { type ReactNode } from "react";
import FlagIcon from "../assets/icons/FlagIcon";
import SunIcon from "../assets/icons/SunIcon";

interface MineTileProps {
    x: number;
    y: number;
    content: number;
    open?: boolean;
    disabled?: boolean;
    tileOpened?: (x: number, y: number) => void;
    tileFlagged?: (x: number, y: number, flagged: boolean) => void;
}

const MineTile: React.FC<MineTileProps> = (props) => {
    const { x, y, content, open, disabled = false, tileOpened, tileFlagged } = props;

    const [ opened, setOpened ] = React.useState<boolean>(open ? open : false);
    const [ flagged, setFlagged ] = React.useState<boolean>(false);
    const [ finalContent, setFinalContent ] = React.useState<string | ReactNode>("");

    const OpenTile = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.type === 'click'){
            if (!flagged && !opened && !disabled) {
                setOpened(!opened);
                tileOpened ? tileOpened(x, y) : "";
            }
        }
    }

    const Flag = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!opened && !disabled) {
            setFlagged(!flagged);
            if (tileFlagged)
                tileFlagged(x, y, !flagged);
        }
    }

    React.useEffect(() => {
        if (content < 1)
            setFinalContent("");
        else if (content > 0 && content < 9)
            setFinalContent(content.toString());
        else 
            setFinalContent(<SunIcon />);
    }, [content])

    React.useEffect(() => {
        setOpened(open ?? false);
    }, [open])

    return (
        <div 
            className={`
                flex 
                aspect-square 
                items-center 
                justify-center 
                rounded-sm 
                ${opened ? 'bg-white text-black' : 'bg-black text-white'}
                ${!opened && !disabled ? 'hover:bg-gray-500' : ""}
                ${!opened && !disabled ? 'cursor-pointer' : ""}
                ${!opened ? 'border' : ""}
                min-w-7
            `}
            onClick={OpenTile}
            onContextMenu={Flag}
        >
            {opened ? finalContent : flagged ? (<FlagIcon />) : ""}
        </div>
    )
}

export default MineTile;