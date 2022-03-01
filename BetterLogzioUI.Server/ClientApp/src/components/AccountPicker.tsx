import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Check from "@mui/icons-material/Check";

import { useAccounts, useSelectedAccount, useChangeAccount } from "../services/auth";
import { ListItemIcon, MenuList } from "@mui/material";
import AddAccountDialog from "./AddAccountDialog";

export default function AccountPicker() {
  const accounts = useAccounts();
  const selectedAccount = useSelectedAccount();
  const changeAccount = useChangeAccount();

  const [showAddAccountDialog, setShowAddAccountDialog] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const selectedIndex = React.useMemo(
    () => accounts.findIndex((o) => o === selectedAccount?.name),
    [selectedAccount, accounts]
  );

  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    changeAccount(accounts[index]);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Time range picker"
        sx={{
          // bgcolor: "background.paper"
          m: 0,
          p: 0,
        }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="Time range"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
          sx={{ pt: 0, pb: 0 }}
        >
          <ListItemText primary="Account" secondary={accounts[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {accounts.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {index === selectedIndex && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            <ListItemText inset={index !== selectedIndex}>{option}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => setShowAddAccountDialog(true)}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>Add new</ListItemText>
        </MenuItem>
      </Menu>
      <AddAccountDialog
        open={showAddAccountDialog}
        onClose={() => setShowAddAccountDialog(false)}
      />
    </div>
  );
}
