import {
  Avatar,
  Box,
  Hidden,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Message from "./Message";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  ArrowBackTwoTone,
  InsertEmoticon,
  Mic,
  SendRounded,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
import { getRecipientEmailLite } from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { makeStyles } from "@mui/styles";

import dynamic from "next/dynamic";
import UploadDialog from "./uploadDialog";

const PickerWithNoSSR = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  InputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    position: "sticky",
    bottom: 0,
    backgroundColor: "white",
    zIndex: 100,
  },
  Header: {
    position: "sticky",
    backgroundColor: "white",
    zIndex: 100,
    top: 0,
    display: "flex",
    padding: "11px",
    height: "80px",
    alignItems: "center",
    borderBottom: "1px solid whitesmoke",
  },

  HeaderInformation: {
    marginLeft: "15px",
    flex: 1,
    "> h3": {
      marginBottom: "3px",
    },
    " > p ": {
      fontSize: "14px",
      color: "gray",
    },
  },

  MessageContainer: {
    padding: "30px",
    backgroundColor: "#e5ded8",
    minHeight: "90vh",
  },
  EndOfMessage: { marginBottom: "50px" },
}));

function ChatScreen({ chat, messages }) {
  const classes = useStyles();

  const [openPicker, setOpenPicker] = useState(false);

  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (fileUrl) {
      setInput(fileUrl);
    }
  }, [fileUrl]);

  const onEmojiClick = (event, emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji);
    setOpenPicker(false);
  };

  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const endOfMessageRef = useRef();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const recipientEmail = getRecipientEmailLite(chat.users, user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const goBackToChats = () => {
    router.push(`/chatPage`);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.Header}>
        <Hidden mdUp>
          <IconButton onClick={goBackToChats} size="large">
            <ArrowBackTwoTone />
          </IconButton>
        </Hidden>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar src={recipientEmail?.photoURL} />
        )}
        <Box className={classes.HeaderInformation}>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipientSnapshot?.lastSeen?.toDate()} />
              ) : (
                "unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
        </Box>
      </Box>
      <Box className={classes.MessageContainer}>
        {showMessages()}
        <Box className={classes.EndOfMessage} ref={endOfMessageRef} />
      </Box>

      <form className={classes.InputContainer}>
        <IconButton size="large" onClick={() => setOpenPicker((val) => !val)}>
          <InsertEmoticon />
        </IconButton>
        <TextField
          multiline
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // TODO: the attachment button is not working yet it needs to show the picture as it uploads it on both sides
          // InputProps={{
          //   endAdornment: (
          //     <UploadDialog setFileUrl={setFileUrl} chatId={router.query.id} />
          //   ),
          // }}
        />
        <IconButton size="large" onClick={sendMessage}>
          <SendRounded />
        </IconButton>
      </form>
      {openPicker && (
        <PickerWithNoSSR
          pickerStyle={{ width: "100%", bottom: 0 }}
          onEmojiClick={onEmojiClick}
          native
          disableSearchBar
          groupNames={{
            smileys_people: "faces",
            animals_nature: "nature",
            food_drink: "food",
            travel_places: "travel",
            activities: "activities",
            objects: "Objects",
            symbols: "symbols",
            flags: "flags",
            recently_used: "recently Used",
          }}
        />
      )}
    </Box>
  );
}

export default ChatScreen;
