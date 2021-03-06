/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { makeStyles, createStyles } from "@material-ui/styles";
// useEffect but with deep equality
import useDeepEffect from "use-deep-compare-effect";

import isEqual from "lodash/isEqual";

const useStyles = makeStyles(_ => createStyles({
    root: {
        // width: "100%",
        // height: "100%",
        display: "grid",
        placeItems: "center",
    },
    box: {
        width: 20,
        height: 20,
        backgroundColor: "gray",
        margin: 5,
    },
    board: {
        maxWidth: 600,
        maxHeight: 600,
    },
    row: {
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: "row",
    }
}));

interface BoardProps {
    /**
     * The snake's current length in blocks
     */
    length: number;
    /**
     * Snake's current head position in coordinates
     */
    snakeHead: {
        x: number;
        y: number;
    };
    /**
     * The food's current coordinates
     */
    food: {
        x: number;
        y: number;
    };
    /**
     * Callback when the snake eats the food, used to change the food's coordinates
     */
    onEat: () => void;
    onMove: (body: BoardProps["snakeHead"][]) => void;
};

type Color = "gray" | "green" | "red";

export default function Board({ snakeHead, length, food, onEat, onMove }: BoardProps) {
    const classes = useStyles();
    
    // here is the array of the snake's body -> Position[], could've used a linked list
    const [body, setBody] = useState<BoardProps["snakeHead"][]>([]);

    useDeepEffect(() => {
        setBody(prev => {
            // see if the food has been eaten
            if (isEqual(food, snakeHead)) {
                onEat();
            };
            // callback when moved
            onMove(prev);

            // if the current length is equal or more than the snake's, then simulate movement
            if (prev.length >= length) {
                return [...prev.slice(1), snakeHead];
            };

            // if it is not longer, then append the snake
            return [...prev, snakeHead];
        });
    }, [snakeHead]);

    const handleBoard = (x: number, y: number): Color => {
        // show the food
        if (x === food.x && y === food.y) return "red";

        // make the snake's body green, and the play area gray
        for (const value of body) {
            if (x === value.x && y === value.y) return "green";
        };
        return "gray";
    };

    return (
        <div className={classes.root}>
            <div className={classes.board}>

                {/** create the board */}
                {Array(20).fill(0).map((_, y) => {
                    return (
                        <div className={classes.row} key={y}>
                        
                            {Array(20).fill(0).map((_, x) => {
                                return (
                                    <div
                                        className={classes.box}
                                        style={{
                                            backgroundColor: handleBoard(x, y),
                                            opacity: handleBoard(x, y) === "gray" ?
                                                0.4 : 1,
                                        }}
                                        key={x}
                                    />
                                );
                            })}

                        </div>
                    );
                })}

            </div>
        </div>
    );
};