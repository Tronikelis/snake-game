import { FC, useState } from "react";

// independent scoped css from material ui
import { makeStyles, createStyles } from "@material-ui/styles";

// these packages make this game so much easier to make :P
import useEventListener from "@use-it/event-listener";
import { useInterval } from "react-interval-hook";

import Board from "./board";

const useStyles = makeStyles(_ => createStyles({
    root: {
        width: "100%",
        height: "100%",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
}));

// movement types
type Movement = "forwards" | "backwards" | "left" | "right";

const Snake: FC = () => {
    const classes = useStyles();

    // should move
    const [move, setMove] = useState(true);

    // current movement state
    const [moving, setMoving] = useState<Movement>("backwards");

    // snake's current position
    const [posX, setPosX] = useState(1);
    const [posY, setPosY] = useState(1);

    // every 0.35 second move the snake 
    useInterval(() => {
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
                break;
        };

        setMove(prev => !prev);
    }, 350);

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
        <div className={classes.root}>
            <h1>Tronikel's shitty snake game</h1>
            <Board
                pos={{
                    x: posX,
                    y: posY,
                }}
                length={5}
                moving={move}
            />
        </div>
    );
};
export default Snake;