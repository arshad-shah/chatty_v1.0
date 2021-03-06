import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRecipientEmailLite } from "../../utils/getRecipientEmail";
import { Box, Hidden } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { stringify } from "zipson";

const useStyles = makeStyles((theme) => ({
  Container: {
    display: "flex",
  },

  ChatContainer: {
    flex: 1,
    overflow: "scroll",
    height: "100vh",
    "::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
  },
}));

function Chat({ chat, messages }) {
  const classes = useStyles();
  const [user] = useAuthState(auth);

  const recipientEmail = getRecipientEmailLite(chat.users, user);
  return (
    <Box className={classes.Container}>
      <Head>
        <title>Chat with {recipientEmail}</title>
      </Head>
      <Hidden mdDown>
        <Sidebar />
      </Hidden>
      <Box className={classes.ChatContainer}>
        <ChatScreen chat={chat} messages={messages} />
      </Box>
    </Box>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  const messagesRef = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRef.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
    }));

  const chatRef = await ref.get();

  const chat = {
    id: chatRef.id,
    ...chatRef.data(),
  };

  return {
    props: {
      messages: stringify(messages),
      chat: chat,
    },
  };
}
