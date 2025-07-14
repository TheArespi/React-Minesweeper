interface HeaderProps {
    title?: string;
    bombsFound: number;
    totalBombs: number;
}

const Header: React.FC<HeaderProps> = (props) => {
    const {title = "Minesweeper", bombsFound, totalBombs} = props;

    return (
        <div className="flex justify-between items-center bg-gray-300 gap-2 p-4 rounded m-1.5">
            <div><h3 className="text-black font-bold">{title}</h3></div>
            <div className="">
                <h3 className="text-black font-bold">Bombs Found {bombsFound}/{totalBombs}</h3>
            </div>
        </div>
    )
}

export default Header;