/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";

import { makeStyles, createStyles } from "@material-ui/styles";
import { isEqual } from "lodash";

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
    length: number;
    move: boolean;

    pos: {
        x: number;
        y: number;
    };
    food: {
        x: number;
        y: number;
    };

    onEat: () => void;
};

type Color = "gray" | "green" | "red";

const Board: FC<BoardProps> = ({ pos, length, move, food, onEat }) => {
    const classes = useStyles();
    
    // here is the array of the snake's body -> Position[], could've used a linked list
    const [previous, setPrevious] = useState<BoardProps["pos"][]>([]);

    useEffect(() => {
        setPrevious(last => {
            // see if the food has been eaten
            if (isEqual(food, pos)) {
                onEat();
            };

            // if the length is equal or more than the length, then simulate movement
            if (last.length >= length) {
                return [...last.slice(1), pos];
            };

            // if it is not longer, then append the snake
            return [...last, pos];
        });
    }, [move]);

    const handleBoard = (x: number, y: number): Color => {
        // show the food
        if (x === food.x && y === food.y) return "red";

        // make the snake's body green, and the play area gray
        for (const value of previous) {
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
export default Board;
