import { FC, useState, useEffect } from "react";

import { usePreviousNumber } from "react-hooks-use-previous";

import Board from "./board";

const Snake: FC = () => {

    // snake pos state
    const [posX, setPosX] = useState(1);
    const [posY, setPosY] = useState(1);

    // gets the previous state
    const prevX = usePreviousNumber(posX, 1);
    const prevY = usePreviousNumber(posY, 1);

    // every 0.5 second move the snake 
    useEffect(() => {
        const interval = setInterval(() => {
            setPosX(prev => prev + 1);
        }, 1000);

        // no memory leak
        return () => clearInterval(interval);
    }, []);

    return (
        <Board
            pos={{
                cur: {
                    x: posX,
                    y: posY,
                },
                prev: {
                    x: prevX,
                    y: prevY,
                },
            }}
            length={2}
        />
    );
};
export default Snake;