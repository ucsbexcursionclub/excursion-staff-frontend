import * as React from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {linkGroupType} from "src/data/links";

const StyledPaper = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    maxWidth: 400,
    color: theme.palette.text.primary
}));

interface Props {
    data: linkGroupType;
}

export default function LinkGrid({data}: Props) {
    return (
        <Box className="w-full" sx={{px: 3}}>
            <Typography
                noWrap
                sx={{fontSize: {xs: "24px", md: "42px", lg: "48px"}}}
                className="text-center py-4 text-gray-200"
            >
                {data.title}
            </Typography>
            <Grid
                container
                rowSpacing={1}
                className="flex bg-lime-200 justify-center align-start rounded-xl"
                columnSpacing={1}
                columns={{xs: 1, sm: 1, md: 2, lg: 2}}
            >
                {data.links.map((item, index) => (
                    <Grid item key={index} className="w-1/4 max-w-1/4 min-w-80 py-4 px-4 flex-grow">
                        <StyledPaper
                            sx={{
                                mx: "auto",
                                p: 2,
                                height: "100%", // make the paper stretch to full height
                                display: "flex",
                                flexDirection: "column", // set flex direction to column
                                justifyContent: "space-between" // if you want the content inside to be spaced evenly
                            }}
                            className="bg-lime-100 text-white rounded-2xl"
                        >
                            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                <Grid item>
                                    <img src={item.imageUrl} alt={item.title} />
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography noWrap fontSize={18} className="font-bold">
                                        {item.title}
                                    </Typography>
                                    <Typography fontSize={12}>{item.description}</Typography>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
