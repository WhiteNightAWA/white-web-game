import React from "react";
import {Card, CardActionArea, CardHeader, Divider, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";


function Home() {
    const navigator = useNavigate();

    return (
        <Stack height={"100%"} width={"100%"} spacing={2}>
            <Typography variant="h1" component="h1">
                WhiteMiniGames
            </Typography>
            <Divider flexItem />
            <Stack>

                {[
                    { name: "正常井字過三關", desc: "", img: null, path: "/tic-tac-toe-normal" },
                    { name: "移動式過三關", desc: "From CarlHo", img: null, path: "/tic-tac-toe-move" }
                ].map((e) => <Card elevation={1} sx={{ mx: 2, my: 1 }}>
                    <CardActionArea onClick={() => navigator(e.path)}>
                        <CardHeader title={e.name} subheader={e.desc} />
                    </CardActionArea>
                </Card>)}
            </Stack>
        </Stack>
    );
}

export default Home;
