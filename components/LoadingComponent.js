import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: "100vh",
  },
  LoadingText: {
    marginTop: "20px",
  },
}));

function LoadingComponent() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CircularProgress color="secondary" size={100} thickness={5} />
      <Typography className={classes.LoadingText} variant="h5">
        Loading...
      </Typography>
    </Box>
  );
}

export default LoadingComponent;
