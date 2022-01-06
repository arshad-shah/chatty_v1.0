//a file upload dialog react functional component that accepts files and also checks them for size and type

import React, { useState } from "react";

import { storage } from "../firebase";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: "10px",
      width: "25ch",
    },
  },
}));

export default function UploadDialog({ setRawFile, setFileUrl, chatId }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isValidFile, setIsValidFile] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setFileName("");
    setFileSize("");
    setFileType("");
    setUploadProgress(0);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorAlert(!errorAlert);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setFileSize(e.target.files[0].size);
    setFileType(e.target.files[0].type);
  };

  const isImage = (fileType) => {
    return fileType === "image/png" || fileType === "image/jpeg";
  };

  const isVideo = (fileType) => {
    return fileType === "video/mp4";
  };

  const isAudio = (fileType) => {
    return fileType === "audio/mp3";
  };

  const isFile = (fileType) => {
    return (
      fileType === "application/pdf" ||
      fileType === "application/doc" ||
      fileType === "application/docx"
    );
  };

  const checkIsValidFile = () => {
    if (
      isImage(fileType) ||
      isVideo(fileType) ||
      isAudio(fileType) ||
      isFile(fileType)
    ) {
      if (fileSize < 10000000) {
        setIsValidFile(true);
      } else {
        setIsValidFile(false);
      }
    } else {
      setIsValidFile(false);
    }
  };

  const handleUpload = () => {
    checkIsValidFile();
    console.log(isValidFile);
    if (isValidFile) {
      const storageRef = storage.ref(`/chats/${chatId}/${file.name}`);
      const task = storageRef.put(file);
      task.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setFileUrl(task.snapshot.ref.getMetadata().name);
            setOpen(false);
          });
        }
      );
    } else {
      setErrorAlert(true);
    }
  };

  return (
    <Box className={classes.root}>
      <IconButton onClick={handleClickOpen}>
        <AttachFileRoundedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
        <DialogContent>
          <DialogContentText>Upload a file to the chat</DialogContentText>
          <input type="file" onChange={handleFileChange} />
          <Typography variant="body2">
            File name: {fileName}, {fileSize} bytes, {fileType} file type
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
        {errorAlert && (
          <Alert severity="error" variant="filled">
            File is not valid. Please upload a valid file.
          </Alert>
        )}
      </Dialog>
    </Box>
  );
}
