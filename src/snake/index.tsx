/* eslint-disable no-restricted-globals */
import create from "zustand";
import produce from "immer";

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
type Coordinates = {
    x: number;
    y: number;
};

interface GlobalState {
    movement: {
        moving: string;
        pos: {
            x: number;
            y: number;
        };
        length: number;
    };
    failed: boolean;
    food: {
        x: number;
        y: number;
    };

    setFood: (pos: Coordinates) => void;
    setMoving: (type: Movement) => void;

    setSnakeX: (x: number) => void;
    setSnakeY: (y: number) => void;

    setSnakeLength: (length: number) => void;
    setFailed: (failed: boolean) => void;
};

const useStore = create<GlobalState>(set => ({
    movement: {
        moving: "backwards",
        pos: {
            x: 0,
            y: 0,
        },
        length: 1,
    },
    failed: false,
    food: {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
    },

    setFood: (pos: Coordinates) => set({ food: pos }),
    setMoving: (type: Movement) => set(produce((state: GlobalState) => {
        state.movement.moving = type;
    })),
    
    setSnakeX: (x: number) => set(produce((state: GlobalState) => {
        state.movement.pos.x += x;
    })),
    setSnakeY: (y: number) => set(produce((state: GlobalState) => {
        state.movement.pos.y += y;
    })),

    setSnakeLength: (length: number) => set(produce((state: GlobalState) => {
        state.movement.length += length;
    })),
    setFailed: (failed: boolean) => set({ failed }),
}));

export default function Snake() {
    const classes = useStyles();

    /**
     * Movement 
    */

    const {
        failed, food, movement, setFood, setSnakeLength, setFailed, setMoving, setSnakeX, setSnakeY
    } = useStore();

    // every 0.3 second move the snake 
    useInterval(() => {
        // console.log("Moved!", movement);
        // handle which way are we moving
        switch (movement.moving) {
            case "forwards":
                setSnakeY(-1);
                break;
            
            case "backwards":
                setSnakeY(1);
                break;
            
            case "right":
                setSnakeX(1);
                break;
            
            case "left":
                setSnakeX(-1);
                break;
        };

        const { x, y } = movement.pos;
        // see if the player failed
        if (x >= 20 || y >= 20 || x <= -1 || y <= -1) {
            console.log("failed");
            setFailed(true);
            return;
        };
    }, 300);

    // handle button presses
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

    // callback when snake eats the food
    const handleEat = () => {
        // lengthen the snake
        setSnakeLength(1);

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
            <h3>Score: {movement.length}</h3>
            {failed ? (<>
                <h1>Game over, score: {movement.length}</h1>
                <button onClick={handleRestart}>Retry?</button>
            </>) : (        
                <Board
                    snakeHead={{
                        ...movement.pos
                    }}
            
                    length={movement.length}
                    food={food}
                    onEat={handleEat}
                    onMove={handleMove}    
                />
            )}
        </div>
    );
};