import { Avatar, Box, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "../components/Chat";
import { useState } from "react";
import CreateChatDialog from "../components/CreateChatDialog";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    borderRight: "1px solid whitesmoke",
  },
  Header: {
    display: "flex",
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    height: "80px",
    borderBottom: "1px solid whitesmoke",
  },
}));
function ChatPage() {
  const classes = useStyles();
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatSnapshot] = useCollection(userChatRef);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const handleClose = (userToChat) => {
    setOpen(false);
    if (!userToChat) return null;
    if (
      EmailValidator.validate(userToChat) &&
      !chatAlreadyExists(userToChat) &&
      userToChat !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, userToChat],
      });
    }
  };

  function createAChat() {
    setOpen(true);
  }

  const chatAlreadyExists = (recipientEmail) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  return (
    <Box className={classes.root}>
      <Box className={classes.Header}>
        <Avatar src={user.photoURL} onClick={() => auth.signOut()} />
        <Box>
          <IconButton onClick={createAChat} size="large">
            <ChatIcon />
          </IconButton>
        </Box>
      </Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={createAChat}
      >
        Start a new chat
      </Button>
      <CreateChatDialog handleClose={handleClose} open={open} />
      {/* List of chats */}
      {chatSnapshot?.docs.map((user) => (
        <Chat key={user.id} id={user.id} users={user.data().users} />
      ))}
    </Box>
  );
}

export default ChatPage;
