import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  InputBase,
  Typography,
} from "@mui/material";
import React from "react";
import { useSignIn } from "../services/auth";
import icon from "../logz-icon.png";

function LoginPage() {
  const [token, setToken] = React.useState("");
  const signIn = useSignIn();

  function handleSubmit() {
    signIn(token);
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card>
        <Box
          sx={{
            display: "flex",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={icon} alt="Logz.io icon" />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Log in to Better Logz.io UI
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Get your API token from{" "}
            <a
              style={{ color: "white" }}
              href="https://app-uk.logz.io/#/dashboard/settings/manage-tokens/api"
            >
              the Logz.io API tokens page
            </a>
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Paste it here:
          </Typography>
          <InputBase
            sx={{ m: 1, flexGrow: 1, width: "100%" }}
            placeholder="Your token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button onClick={handleSubmit} size="small" color="primary">
            Save
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default LoginPage;
