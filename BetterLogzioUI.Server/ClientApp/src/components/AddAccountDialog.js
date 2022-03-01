import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  InputBase,
  Typography,
} from "@mui/material";
import React from "react";
import { useSignIn } from "../services/auth";
import icon from "../logz-icon.png";

function AddAccountDialog({ open, onClose }) {
  const [token, setToken] = React.useState("");
  const [name, setName] = React.useState("");
  const signIn = useSignIn();

  function handleSubmit() {
    signIn({ token, name });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
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
              target="_blank"
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
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Give it a name
          </Typography>
          <InputBase
            sx={{ m: 1, flexGrow: 1, width: "100%" }}
            placeholder="Account name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button onClick={handleSubmit} size="small" color="primary">
            Save
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
}

export default AddAccountDialog;
