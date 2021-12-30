import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/dist/client/router";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  avatarInChat: {
    margin: "5px",
  },
}));
function Chat({ id, users }) {
  const classes = useStyles();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);
  return (
    <List className={classes.root}>
      <ListItem button onClick={enterChat}>
        {recipient ? (
          <ListItemAvatar>
            <Avatar
              className={classes.avatarInChat}
              src={recipient?.photoURL}
            />
          </ListItemAvatar>
        ) : (
          <ListItemAvatar>
            <Avatar className={classes.avatarInChat} src={recipientEmail[0]} />
          </ListItemAvatar>
        )}
        <ListItemText primary={recipientEmail} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}

export default Chat;
