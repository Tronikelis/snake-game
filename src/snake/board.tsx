import { FC, useEffect, useState } from "react";

import { makeStyles, createStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => createStyles({
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
    pos: {
        x: number;
        y: number;
    };
    length: number;
    moving: boolean
};

type Color = "gray" | "green";

const Board: FC<BoardProps> = ({ pos, length, moving }) => {
    const classes = useStyles();
    
    
    // linked list?
    const [previous, setPrevious] = useState<BoardProps["pos"][]>([]);

    useEffect(() => {
        setPrevious(last => {
            // if the length is equal or more than the length then simulate movement
            if (last.length >= length) {
                return [...last.slice(1), pos];
            };

            // if it is not longer then append the snake
            return [...last, pos];
        });
    }, [moving, length]);

    const handleSnakeBody = (x: number, y: number): Color => {
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
                                            backgroundColor: handleSnakeBody(x, y),
                                            opacity: handleSnakeBody(x, y) === "gray" ?
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
