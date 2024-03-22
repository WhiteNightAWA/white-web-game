import {Box, Button, Fade, Stack, Typography} from "@mui/material";
import {CircleOutlined, Clear, Repeat} from "@mui/icons-material";
import {generateBox} from "./components/Board";
import {useState} from "react";

function TicTacToeMove() {
    const [board, setBoard] = useState(new Array(5).fill(new Array(5).fill(null)));
    const [xTurn, setXTurn] = useState(true);
    const [hover, setHover] = useState([-1, -1]);
    const [win, setWin]: [{
        winner: string,
        positions: Array<Array<number>>
    }, any] = useState({winner: "", positions: []});
    const [selected, setSelected] = useState([2, 2]);
    const [canAdd, setCanAdd] = useState(true);

    const [addCount, setAddCount] = useState(0);

    // drag
    const [move, setMove] = useState([-1, -1]);
    const [moveFrame, setMoveFrame] = useState(false);
    const [canFrame, setCanFrame] = useState({X: true, Y: true});


    function getCursor(i: number, j: number) {
        if (win.winner) return "not-allowed"

        if (moveFrame) {
            if (0 < i && i < 4 && 0 < j && j < 4) {
                if (i === selected[0] && j === selected[1]) return  "not-allowed"
                return "pointer"
            } else {
                return "not-allowed"
            }
        }
        if (canAdd) {
            if (![0, 1, 2].includes(i - selected[0] + 1) || ![0, 1, 2].includes(j - selected[1] + 1)) return "not-allowed"
            if (!board[i][j]) return "pointer"
        } else {
            if (move[0] !== -1 && !board[i][j]) {
                if ([0, 1, 2].includes(i - selected[0] + 1) && [0, 1, 2].includes(j - selected[1] + 1)) return "pointer"
            }
            if (board[i][j] === (xTurn ? "X" : "O")) return "pointer"
            if (board[i][j] !== (xTurn ? "X" : "O")) return "not-allowed"
            if (!board[i][j]) return "not-allowed"
        }
    }

    function checkWinner(board: Array<Array<string>>, i: number, j: number) {
        function getBitboard(board: Array<Array<string>>, symbol: string) {
            let bitboard = 0;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === symbol) {
                        const index = row * 3 + col;
                        bitboard |= 1 << index;
                    }
                }
            }
            return bitboard;
        }

        function getPositions(bitboard: number) {
            const positions: Array<Array<number>> = [];
            for (let x = 0; x < 9; x++) {
                if ((bitboard & (1 << x)) !== 0) {
                    const row = Math.floor(x / 3);
                    const col = x % 3;
                    positions.push([row + i - 1, col + j - 1]);
                }
            }
            return positions;
        }

        const xBoard = getBitboard(board, "X");
        const oBoard = getBitboard(board, "O");

        const winningBitboards = [
            0b111000000, 0b000111000, 0b000000111, // Rows
            0b100100100, 0b010010010, 0b001001001, // Columns
            0b100010001, 0b001010100 // Diagonals
        ];

        for (const bitboard of winningBitboards) {
            if ((xBoard & bitboard) === bitboard) {
                return {winner: "X", positions: getPositions(bitboard)};
            }
            if ((oBoard & bitboard) === bitboard) {
                return {winner: "O", positions: getPositions(bitboard)};
            }
        }

        return {winner: "", positions: []};
    }

    function isPositionInWinningPositions(position: Array<number>, winningPositions: Array<Array<number>>) {
        for (const [row, col] of winningPositions) {
            if (row === position[0] && col === position[1]) {
                return true;
            }
        }
        return false;
    }

    return (
        <Stack justifyContent="center" alignItems="center" height={"90vh"} spacing={2}>

            <Typography variant="h2">
                {win.winner ? (win.winner === "draw" ? <>
                    GG, 打和!
                </> : <Stack direction="row" alignItems="center">
                    GG, {win.winner === "X" ? <Clear sx={{fontSize: "1em", color: "rgb(255, 0, 0)"}}/>
                    : <CircleOutlined sx={{fontSize: "1em", color: "rgb(73, 216, 230)"}}/>}贏咗!
                </Stack>) : <Stack direction="row" alignItems="center">依家到{xTurn ?
                    <Clear sx={{fontSize: "1em", color: "rgb(255, 0, 0)"}}/>
                    : <CircleOutlined sx={{fontSize: "1em", color: "rgb(73, 216, 230)"}}/>}</Stack>}

            </Typography>
            <Typography variant={"h5"}>
                {canAdd
                    ? <Stack direction="row" alignItems="center">你依家只可以畫<Clear
                        sx={{color: "rgb(255, 0, 0)"}}/><CircleOutlined sx={{color: "rgb(73, 216, 230)"}}/></Stack>
                    :
                    <Stack direction="row" alignItems="center">
                        <Repeat sx={{ color: "rgb(255, 0, 0)", filter: canFrame.X ? "" : "grayscale()" }}/>
                        <Repeat sx={{ color: "rgb(73, 216, 230)", filter: canFrame.Y ? "" : "grayscale()", mr: 2 }}/>
                        你依家只可以郁框同<Clear sx={{color: "rgb(255, 0, 0)"}}/><CircleOutlined
                        sx={{color: "rgb(73, 216, 230)"}}/>
                        <Button onClick={() => setMoveFrame(!moveFrame)} sx={{ml: 2}}
                                variant={moveFrame ? "outlined" : "contained"} startIcon={<Repeat/>}
                                disabled={(xTurn ? !canFrame.X : !canFrame.Y) || win.winner !== ""}>
                            郁框
                        </Button>
                    </Stack>
                }
            </Typography>

            <Stack>
                {[
                    ["LT", "T", "T", "T", "RT"],
                    ["L", "", "", "", "R"],
                    ["L", "", "", "", "R"],
                    ["L", "", "", "", "R"],
                    ["LB", "B", "B", "B", "RB"],
                ].map((row, i) =>
                    <Stack direction={"row"}>
                        {row.map((cell, j) => <Box
                            sx={{
                                ...generateBox(cell
                                    + (([0, 1, 2].includes(i - selected[0] + 1) && [0, 1, 2].includes(j - selected[1] + 1)) ? ("DS"
                                        + (["t", "", "b"][i - selected[0] + 1]) + (["l", "", "r"][j - selected[1] + 1])
                                    ) : "D")
                                ),
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: getCursor(i, j),
                                backgroundColor: isPositionInWinningPositions([i, j], win.positions) ? "white" : "",
                            }}
                            onMouseEnter={() => setHover([i, j])}
                            onMouseLeave={() => setHover([-1, -1])}
                            onClick={() => {
                                if (moveFrame) {
                                    if (0 < i && i < 4 && 0 < j && j < 4) {
                                        if (i === selected[0] && j === selected[1]) return
                                        setSelected([i, j]);
                                        setXTurn(!xTurn);
                                        setMoveFrame(false);

                                        let newBoard = JSON.parse(JSON.stringify(board)).slice(i - 1, i + 2).map((row: Array<number>) => row.slice(j - 1, j + 2));
                                        console.log(newBoard);

                                        if (xTurn) setCanFrame({X: false, Y: canFrame.Y})
                                        if (!xTurn) setCanFrame({Y: false, X: canFrame.X})
                                        let res = checkWinner(newBoard, i, j); // get 3^2 array in 5^2 array
                                        console.log(res);
                                        if (res.winner) setWin(res);
                                    }
                                } else {
                                    if (!board[i][j] && !win.winner && [0, 1, 2].includes(i - selected[0] + 1) && [0, 1, 2].includes(j - selected[1] + 1) && canAdd) {
                                        if (addCount + 1 > 4) setCanAdd(false);
                                        if (xTurn) setAddCount(addCount + 1);
                                        console.log(addCount);
                                        let newBoard = JSON.parse(JSON.stringify(board));
                                        newBoard[i][j] = xTurn ? "X" : "O";
                                        setXTurn(!xTurn);
                                        setBoard(newBoard);

                                        let res = checkWinner(
                                            newBoard.slice(selected[0] - 1, selected[0] + 2).map((row: Array<number>) => row.slice(selected[1] - 1, selected[1] + 2)),
                                            selected[0], selected[1]
                                        ); // get 3^2 array in 5^2 array
                                        console.log(res);
                                        if (res.winner) setWin(res)

                                    } else if (!canAdd && !win.winner && board[i][j]) {
                                        if (board[i][j] === (xTurn ? "X" : "O")) {
                                            if (i === move[0] && j === move[1]) {
                                                setMove([-1, -1])
                                            } else {
                                                setMove([i, j])
                                            }
                                        }
                                    } else if (!canAdd
                                        && !win.winner
                                        && move[0] !== -1 && move[1] !== -1 && !board[i][j]
                                        && [0, 1, 2].includes(i - selected[0] + 1)
                                        && [0, 1, 2].includes(j - selected[1] + 1)
                                    ) {
                                        console.log("Change");
                                        let newBoard = JSON.parse(JSON.stringify(board));
                                        newBoard[move[0]][move[1]] = null;
                                        newBoard[i][j] = xTurn ? "X" : "O";
                                        setXTurn(!xTurn);
                                        setBoard(newBoard);
                                        setMove([-1, -1])

                                        if (xTurn) setCanFrame({X: true, Y: canFrame.Y})
                                        if (!xTurn) setCanFrame({Y: true, X: canFrame.X})

                                        let res = checkWinner(
                                            newBoard.slice(selected[0] - 1, selected[0] + 2).map((row: Array<number>) => row.slice(selected[1] - 1, selected[1] + 2)),
                                            selected[0], selected[1]
                                        ); // get 3^2 array in 5^2 array
                                        console.log(res);
                                        if (res.winner) setWin(res);
                                    }
                                }
                            }}
                        >
                            {!board[i][j]
                                && [0, 1, 2].includes(i - selected[0] + 1) && [0, 1, 2].includes(j - selected[1] + 1)
                                && canAdd
                                &&
                                <Fade in={hover[0] === i && hover[1] === j && !board[i][j] && !win.winner}
                                      timeout={200}>
                                    {xTurn
                                        ? <Clear sx={{fontSize: "6em", color: "rgba(255, 0, 0, 0.25)"}}/>
                                        : <CircleOutlined sx={{fontSize: "6em", color: "rgba(73, 216, 230, 0.25)"}}/>
                                    }
                                </Fade>
                            }
                            {board[i][j] !== null && (board[i][j] === "X"
                                    ? <Clear sx={{
                                        fontSize: "6em", color: `rgba(255, 0, 0, ${
                                            move[0] === i && move[1] === j ? 0.25 : 1
                                        })`
                                    }}/>
                                    : <CircleOutlined sx={{
                                        fontSize: "6em", color: `rgba(73, 216, 230, ${
                                            move[0] === i && move[1] === j ? 0.25 : 1
                                        })`
                                    }}/>
                            )}
                        </Box>)}
                    </Stack>
                )}
            </Stack>

            <Button onClick={() => window.location.reload()}>
                再嚟
            </Button>

        </Stack>
    );
}

export default TicTacToeMove;
