import { FC, useEffect } from "react";

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
};

type Color = "gray" | "green";

const Board: FC<BoardProps> = ({ pos }) => {
    const classes = useStyles();
    
    const { cur, prev } = pos;
    
    const handleSnake = (x: number, y: number): Color => {
       
        if (x === cur.x && y === cur.y) return "green";
        if (x === prev.x && y === prev.y) return "green";

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
