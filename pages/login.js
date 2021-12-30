import Head from "next/head";
import { Box, Button, FormGroup, Link, TextField } from "@mui/material";
import { auth, providerGoogle, signIn, signUp } from "../firebase";
import { useState } from "react";
import * as EmailValidator from "email-validator";
import validator from "validator";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { Alert } from '@mui/material';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
Container: {
  display: "grid",
  placeItems: "center",
  height: "100vh",
  backgroundColor: "whitesmoke",
},

SignUpLink: {
  padding: "10px",
},

LoginContainer: {
  padding: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: "5px",
  boxShadow: "0px 4px 14px - 3px rgba(0, 0, 0, 0.7)",
},

Logo: {
  height: "200px",
  width: "200px",
  marginBottom: "50px",
},


}));

function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [pageState, setPageState] = useState(true);

  const [createUserWithEmailAndPassword, errorSignUp] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, errorSignIn] =
    useSignInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = () => {
    auth.signInWithPopup(providerGoogle).catch(alert);
  };

  const validPassword = (pass) => {
    const validatePassword = validator.isStrongPassword(pass, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
    if (validatePassword) {
      return true;
    } else {
      return false;
    }
  };

  const shouldDisableButton = () => {
    if (!email && !password) {
      return true;
    }
    if (!EmailValidator.validate(email) || !validPassword(password)) {
      return true;
    } else {
      return false;
    }
  };

  const isRepeatPasswordValid = (repeatPass) => {
    const isRepeatPassValid = validPassword(repeatPass);
    if (isRepeatPassValid) {
      const isPassAndRepeatPassSame = password.localeCompare(repeatPass);
      if (isPassAndRepeatPassSame === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const goToSignUp = () => {
    setPageState(false);
  };

  const goToSignIn = () => {
    setPageState(true);
  };
  return (
    <Box className={classes.Container}>
      <Head>
        <title>Login</title>
      </Head>

      <Box className={classes.LoginContainer}>
        <img className={classes.Logo} src="/logo.svg" />
        {!pageState ? <h1>Signup</h1> : <h1>Login</h1>}
        <FormGroup
          sx={{
            padding: "1rem",
          }}
        >
          <TextField
            error={!EmailValidator.validate(email) && email.length > 0}
            required
            value={email}
            label="Email"
            margin="dense"
            type="email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={!validPassword(password) && password.length > 0}
            required
            value={password}
            label="Password"
            margin="dense"
            type="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!pageState && (
            <TextField
              error={
                repeatPassword.length > 0 &&
                !isRepeatPasswordValid(repeatPassword)
              }
              required
              value={repeatPassword}
              label="Repeat Password"
              margin="dense"
              type="password"
              variant="outlined"
              onChange={(e) => setRepeatPassword(e.target.value)}
              helperText={
                isRepeatPasswordValid(repeatPassword)
                  ? "Password is a match"
                  : " "
              }
            />
          )}
          {errorSignUp && (
            <Alert severity="error">
              An error occurred while signing you up. Please try again
            </Alert>
          )}

          {errorSignIn && (
            <Alert severity="error">
              An error occurred while signing you in. Please try again
            </Alert>
          )}

          {!pageState ? (
            <>
              <Button
                style={{ marginBottom: "10px" }}
                variant="contained"
                disabled={shouldDisableButton()}
                onClick={() => createUserWithEmailAndPassword(email, password)}
              >
                Signup
              </Button>
              <Button variant="outlined" onClick={signInWithGoogle}>
                Signup with google
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                disabled={shouldDisableButton()}
                onClick={() => signInWithEmailAndPassword(email, password)}
              >
                Login
              </Button>
              <Button variant="outlined" onClick={signInWithGoogle}>
                Sign in with google
              </Button>
            </>
          )}
        </FormGroup>
        {!pageState ? (
          <Box className={classes.SignUpLink}>
            <p>Have an account</p>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => goToSignIn()}
            >
              Login
            </Button>
          </Box>
        ) : (
          <Box className={classes.SignUpLink}>
            <p>Dont have an account</p>
            <Button fullWidth variant="outlined" onClick={() => goToSignUp()}>
              Signup
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Login;
