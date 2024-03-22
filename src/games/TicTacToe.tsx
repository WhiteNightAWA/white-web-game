import {Box, Button, Fade, Stack, Typography} from "@mui/material";
import {CircleOutlined, Clear} from "@mui/icons-material";
import {generateBox} from "./components/Board";
import {useState} from "react";

function TicTacToe() {
    const [board, setBoard] = useState(new Array(3).fill(new Array(3).fill(null)));
    const [xTurn, setXTurn] = useState(true);
    const [hover, setHover] = useState([-1, -1]);
    const [win, setWin]: [{
        winner: string,
        positions: Array<Array<number>>
    }, any] = useState({winner: "", positions: []});
    function checkWinner(board: Array<Array<string>>) {
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
            const positions = [];
            for (let i = 0; i < 9; i++) {
                if ((bitboard & (1 << i)) !== 0) {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    positions.push([row, col]);
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

        if ((xBoard | oBoard) === 0b111111111) {
            return {winner: "draw", positions: []};
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

            <Stack>
                {[
                    ["LT", "T", "RT"],
                    ["L", "", "R"],
                    ["LB", "B", "RB"],
                ].map((row, i) =>
                    <Stack direction={"row"}>
                        {row.map((cell, j) => <Box
                            sx={{
                                ...generateBox(cell),
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: win.winner ? "not-allowed" : (board[i][j] ? "auto" : "pointer"),
                                backgroundColor: isPositionInWinningPositions([i, j], win.positions) ? "white" : "",
                            }}
                            onMouseEnter={() => setHover([i, j])}
                            onMouseLeave={() => setHover([-1, -1])}
                            onClick={() => {
                                if (!board[i][j] && !win.winner) {
                                    let newBoard = JSON.parse(JSON.stringify(board));
                                    newBoard[i][j] = xTurn ? "X" : "O";
                                    setXTurn(!xTurn);
                                    setBoard(newBoard);

                                    let res = checkWinner(newBoard);
                                    console.log(res);
                                    if (res.winner) setWin(res)

                                }
                            }}
                        >
                            {!board[i][j] &&
                                <Fade in={hover[0] === i && hover[1] === j && !board[i][j] && !win.winner}>
                                    {xTurn
                                        ? <Clear sx={{fontSize: "6em", color: "rgba(255, 0, 0, 0.25)"}}/>
                                        : <CircleOutlined sx={{fontSize: "6em", color: "rgba(73, 216, 230, 0.25)"}}/>
                                    }
                                </Fade>
                            }
                            {board[i][j] !== null && (board[i][j] === "X"
                                    ? <Clear sx={{fontSize: "6em", color: "rgb(255, 0, 0)"}}/>
                                    : <CircleOutlined sx={{fontSize: "6em", color: "rgb(73, 216, 230)"}}/>
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

export default TicTacToe;
