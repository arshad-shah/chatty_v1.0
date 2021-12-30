import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import { useState } from "react";
import * as EmailValidator from "email-validator";


function CreateChatDialog({ open, handleClose }) {
  const [userToChat, setUserToChat] = useState("");
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(userToChat)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create A Chat</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter an email address of the user that you wish to chat
        </DialogContentText>
        <TextField
          error={!EmailValidator.validate(userToChat) && userToChat.length > 0}
          autoFocus
          value={userToChat}
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          onChange={(e) => setUserToChat(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(userToChat)} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!EmailValidator.validate(userToChat)}
          onClick={() => handleClose(userToChat)}
          color="primary"
        >
          Create Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateChatDialog;
