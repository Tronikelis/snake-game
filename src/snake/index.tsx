/* eslint-disable no-restricted-globals */
import { FC, useState } from "react";

// independent scoped css from material ui
import { makeStyles, createStyles } from "@material-ui/styles";

// these packages make this game so much easier to make :P
import useEventListener from "@use-it/event-listener";
import { useInterval } from "react-interval-hook";

// lodash functions
import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith"

// snake's board
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

// coordinate type
interface Coordinates {
    x: number;
    y: number;
};

const Snake: FC = () => {
    const classes = useStyles();

    /**
     * Movement 
    */

    // should move
    const [move, setMove] = useState(true);

    // current movement state
    const [moving, setMoving] = useState<Movement>("backwards");

    // snake's current position
    const [posX, setPosX] = useState(1);
    const [posY, setPosY] = useState(1);

    // snake's current length
    const [length, setLength] = useState(1);

    // if failed state
    const [failed, setFailed] = useState(false);

    // every 0.3 second move the snake 
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

        // see if the player failed
        if (posX >= 20 || posY >= 20 || posX <= -1 || posY <= -1) {
            console.log("failed");
            setFailed(true);
            return;
        };

        // this state exists just to fire useEffect in my board component
        setMove(prev => !prev);
    }, 300);

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

    /**
     * Food 
    */

    // food's position
    const [food, setFood] = useState<Coordinates>({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
    });

    // callback when snake eats the food
    const handleEat = () => {
        // lengthen the snake
        setLength(prev => prev + 1);

        // set new food coords
        setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
        });
    };

    /**
     * Game over
    */

    // reload the page when retrying
    const handleRestart = () => {
        location.reload();
    };

    // callback when the snake moved and the param is the snake's body
    const handleMove = (body: Coordinates[]) => {
        // check if the snake collided with itself
        
        // remove duplicates and check with the original length
        const dupes = uniqWith(body, isEqual);
        // if we have some duplicates that means the snake is within itself
        // set failed to true
        if (dupes.length !== body.length) setFailed(true);
    };

    return (
        <div className={classes.root}>
            <h1>Tronikel's shitty snake game</h1>
            <h3>Score: {length}</h3>
            {failed ? (<>
                <h1>Game over, score: {length}</h1>
                <button onClick={handleRestart}>Retry?</button>
            </>) : (        
                <Board
                    snakeHead={{
                        x: posX,
                        y: posY,
                    }}
                    move={move}

                    length={length}
                    food={food}
                    onEat={handleEat}
                    onMove={handleMove}    
                />
            )}
        </div>
    );
};
export default Snake;