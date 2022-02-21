import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";

const options = [
  { value: "now-15m", label: "Last 15 minutes" },
  { value: "now-1h", label: "Last 1 hour" },
  { value: "now-4h", label: "Last 4 hours" },
  { value: "now-1d", label: "Last 1 day" },
  { value: "now-2d", label: "Last 2 days" },
  { value: "now-3d", label: "Last 3 days" },
  { value: "now-7d", label: "Last 7 days" },
  { value: "now-15d", label: "Last 15 days" },
  { value: "now-1M", label: "Last 1 month" },
];

export default function TimePicker() {
  const { timeRange } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const selectedIndex = React.useMemo(
    () => options.findIndex((o) => o.value === timeRange),
    [timeRange]
  );

  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    navigate(
      { pathname: `/logs/${options[index].value}`, search: location.search },
      { replace: true }
    );
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (selectedIndex === -1) {
    return <Navigate to={`/logs/${options[0].value}`} replace />;
  }

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
          <ListItemText primary="Time range" secondary={options[selectedIndex].label} />
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
        {options.map((option, index) => (
          <MenuItem
            key={option.value}
            // disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
