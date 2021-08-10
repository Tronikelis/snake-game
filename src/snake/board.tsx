import { FC, useEffect, useState } from "react";

import { makeStyles, createStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
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
        cur: {
            x: number;
            y: number;
        };
        prev: {
            x: number;
            y: number;
        };
    };
    length: number;
    moving: boolean
};

type Color = "gray" | "green";

const Board: FC<BoardProps> = ({ pos, length, moving }) => {
    const classes = useStyles();
    
    const { cur, prev } = pos;
    
    // linked list?
    const [previous, setPrevious] = useState<typeof pos["cur"][]>([]);

    useEffect(() => {
        setPrevious(last => {
            // remove the tail is longer
            if (last.length > length) {
                return [...last.slice(1), cur];
            };
            return [...last, cur];
        });
    }, [moving, length]);

    const handleSnake = (x: number, y: number): Color => {
       
        // if (x === cur.x && y === cur.y) return "green";
        // // check if length is more than 2

        // if (length <= 2) return "gray";

        // if (x === prev.x && y === prev.y) return "green";

        // return "gray";
        
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
                                            backgroundColor: handleSnake(x, y)
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
