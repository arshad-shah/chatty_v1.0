import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const useStyles = makeStyles((theme) => ({
Sender : {
  marginLeft: "auto",
  backgroundColor: "#dcf8c6",
  display: "flex",
    width: "fit-content",
  padding: "5px",
  borderRadius: "8px",
  margin: "10px",
  paddingBottom: "17px",
  minWidth: "60px",
  position: "relative",
  textAlign: "right",
},


Reciever: {
  backgroundColor: "whitesmoke",
  textAlign: "left",
    width: "fit-content",
  padding: "5px",
  borderRadius: "8px",
  margin: "10px",
  paddingBottom: "17px",
  minWidth: "60px",
  position: "relative",
  textAlign: "right",
},


Timestamp: {
  color: "gray",
  padding: "5px",
  fontSize: "9px",
  position: "absolute",
  bottom: 0,
  textAlign: "right",
  right: 0,
},

}));
function Message({ user, message }) {
  const classes = useStyles();
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? classes.Sender : classes.Reciever;
  return (
    <Box>
      <Box className={TypeOfMessage}>
        <Box>
          <span>
            <span>{message.message}</span>
          </span>
        </Box>
        <Box>
          <Box className={classes.Timestamp}>
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Message;
