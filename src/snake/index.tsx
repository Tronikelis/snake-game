import { FC, useState, useEffect } from "react";

import { usePreviousNumber } from "react-hooks-use-previous";
import useEventListener from "@use-it/event-listener";

import Board from "./board";

// movement types
type Movement = "forwards" | "backwards" | "left" | "right";

const Snake: FC = () => {

    // should move
    const [move, setMove] = useState(true);

    // current movement state
    const [moving, setMoving] = useState<Movement>("backwards");

    // snake pos state
    const [posX, setPosX] = useState(1);
    const [posY, setPosY] = useState(1);

    // gets the previous state
    const prevX = usePreviousNumber(posX, posX);
    const prevY = usePreviousNumber(posY, posY);

    // every 0.5 second move the snake 
    useEffect(() => {
        const interval = setInterval(() => {

           
            // handle which way are we moving
            switch (moving) {
                case "forwards":
                    setPosY(prev => prev - 1);
                    break;
                
                case "backwards":
                    setPosY(prev => prev + 1);
                    break;
                
                case "right":
                    setPosX(prev => prev + 1);
                    break;
                
                case "left":
                    setPosX(prev => prev - 1);
            };

            setMove(prev => !prev);
        }, 500);

        // no memory leak
        return () => clearInterval(interval);
    }, [moving]);

    // console.log({
    //     cur: {
    //         x: posX,
    //         y: posY,
    //     },
    //     prev: {
    //         x: prevX,
    //         y: posY,
    //     },
    // });

    // handle movement
    useEventListener("keydown", (event: KeyboardEvent) => {

        // w = 87
        // a = 65
        // s = 83
        // d = 68
        switch (event.keyCode) {
            case 87:
                setMoving("forwards");
                break;
            case 65:
                setMoving("left");
                break;
            case 83:
                setMoving("backwards");
                break;
            case 68:
                setMoving("right");
                break;
        };
    });

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
            length={3}
            moving={move}
        />
    );
};
export default Snake;