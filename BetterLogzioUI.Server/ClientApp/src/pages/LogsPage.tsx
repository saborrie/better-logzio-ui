import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Drawer,
  IconButton,
  InputBase,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useVirtual } from "react-virtual";
import { Scrollbars } from "react-custom-scrollbars";

import { useScroll, QueryResult } from "../services/api";
import { useInfiniteQuery } from "react-query";
import TimePicker from "../components/TimePicker";
import { useParams, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FilterTags from "../components/FilterTags";
import FieldTable from "../components/FieldTable";

const drawerWidth = 600;
const minDrawerWidth = "50%";

function LogsPage() {
  const { timeRange } = useParams();
  const [searchParams] = useSearchParams();
  const selectedTypes = searchParams.getAll("type");
  const selectedLevels = searchParams.getAll("level");

  const [open, setOpen] = React.useState<any | null>(null);

  const theme = useTheme();

  const scroll = useScroll();

  function getLevelColour(source: any) {
    if (source) {
      switch ((source.Level || source.level)?.toLowerCase()) {
        case "error":
          return theme.palette.error.main;
        case "warn":
        case "warning":
          return theme.palette.warning.main;
        case "info":
        case "information":
          return theme.palette.info.main;
      }
    }
    return theme.palette.grey[300];
  }

  const {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ["logs", timeRange, selectedTypes, selectedLevels],
    async ({ pageParam = undefined }) => {
      return await scroll(timeRange, { type: selectedTypes, level: selectedLevels }, pageParam);
    },
    {
      getNextPageParam: (lastGroup, groups) =>
        lastGroup.hits.length > 0 ? lastGroup.scrollId : undefined,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const parentRef = React.useRef();

  const items = data ? data.pages.map((p) => p.hits).flat(1) : [];

  const rowVirtualizer = useVirtual({
    size: hasNextPage ? items.length + 1 : items.length,
    parentRef,
    overscan: 100,
    estimateSize: React.useCallback(() => 24, []),
  });

  const applyScrollbarsRef = React.useCallback((scrollbarsRef) => {
    parentRef.current = (scrollbarsRef as any)?.view;
  }, []);

  const renderRow = React.useCallback(
    (virtualRow) => {
      const isLoaderRow = virtualRow.index > items.length - 1;

      const style = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      };

      if (isLoaderRow) {
        return (
          <Row key={virtualRow.index} style={style}>
            {hasNextPage ? "Loading..." : "No more items."}
          </Row>
        );
      }
      const item = items[virtualRow.index];
      return (
        <Row
          onClick={() => setOpen((x: any) => (x?._id === item._id ? null : item))}
          active={open?._id === item._id}
          key={virtualRow.index}
          style={style}
        >
          <Box
            sx={{
              mr: 2,
              width: "4px",
              height: "1rem",
              background: getLevelColour(item._source),
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <Typography variant="body1" sx={{ ml: 2, flexShrink: 0 }}>
            {item._source?.["@timestamp"] &&
              format(Date.parse(item._source?.["@timestamp"]), "MMM dd HH:mm:ss.SSS", {})}
          </Typography>
          <Box
            sx={{
              ml: 4,
              mr: 4,
              width: "2px",
              height: "0.6rem",
              background: (theme) => theme.palette.divider,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <Typography variant="body1" sx={{ mr: 1, width: 240, flexShrink: 0 }}>
            {item._source?.type}
          </Typography>
          <Box
            sx={{
              ml: 4,
              mr: 4,
              width: "2px",
              height: "0.6rem",
              background: (theme) => theme.palette.divider,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body1"
            sx={{ overflow: "hidden", whiteSpace: "no-wrap", height: "100%" }}
          >
            {getMessage(item._source)}
          </Typography>
        </Row>
      );
    },
    [items, open, hasNextPage]
  );

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= items.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    items.length,
    isFetchingNextPage,
    rowVirtualizer.virtualItems,
    timeRange,
    selectedTypes,
    selectedLevels,
  ]);

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ color: "success.main", ml: 4, mr: 2 }}
              onClick={() => refetch()}
            >
              <PlayArrowIcon />
            </IconButton>
            <TimePicker />
            <FilterTags />

            {/* <Box sx={{ ml: 2, p: 1, flexGrow: 1 }}>
              <InputBase sx={{ width: "100%" }} placeholder="search" />
            </Box> */}
          </Toolbar>
        </AppBar>
        <Box sx={{ width: "100%", flexGrow: 1, overflow: "hidden", display: "flex" }}>
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              height: "100%",
              borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Scrollbars
              renderThumbVertical={() => (
                <Box sx={{ background: (theme) => theme.palette.divider }} />
              )}
            >
              <Sidebar />
            </Scrollbars>
          </Box>
          <Box
            // ref={parentRef}
            sx={{ flexGrow: 1, height: "100%", width: `100%`, overflow: "auto" }}
          >
            <Scrollbars
              ref={applyScrollbarsRef}
              renderThumbVertical={() => (
                <Box sx={{ background: (theme) => theme.palette.divider }} />
              )}
            >
              <Box
                sx={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.virtualItems.map(renderRow)}
              </Box>
            </Scrollbars>
          </Box>
        </Box>
      </Box>
      <Drawer
        sx={{
          minWidth: minDrawerWidth,
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            minWidth: minDrawerWidth,
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open !== null}
      >
        <Scrollbars
          renderThumbVertical={() => <Box sx={{ background: (theme) => theme.palette.divider }} />}
          renderThumbHorizontal={() => (
            <Box sx={{ background: (theme) => theme.palette.divider }} />
          )}
        >
          {open !== null && (
            <>
              <Box
                sx={{
                  backgroundColor: getLevelColour(open?._source),
                  height: 8,
                }}
              ></Box>
              <Box sx={{ p: 8 }}>
                <Box sx={{ display: "flex", mb: 12, alignItems: "center" }}>
                  <Paper
                    sx={{
                      pt: 0,
                      pl: 4,
                      pr: 4,
                      pb: 0,
                      backgroundColor: getLevelColour(open?._source),
                      color: theme.palette.getContrastText(getLevelColour(open?._source)),
                    }}
                  >
                    <Typography variant="overline">{getLevel(open?._source)}</Typography>
                  </Paper>
                  <Typography sx={{ ml: 4 }}>
                    {open?._source?.["@timestamp"] &&
                      format(Date.parse(open?._source?.["@timestamp"]), "MMM dd HH:mm:ss.SSS", {})}
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={() => setOpen(null)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Paper sx={{ p: 8, mb: 4 }}>{getMessage(open?._source)}</Paper>

                {((x) =>
                  x && (
                    <Paper sx={{ p: 8, mb: 4, whiteSpace: "pre-wrap", maxWidth: "100%" }}>
                      {x}
                    </Paper>
                  ))(getException(open?._source))}

                <Box sx={{ display: "flex", mb: 12 }}>
                  <Paper sx={{ p: 8, flex: 1 }}>
                    <Typography variant="overline">Type</Typography>
                    <Typography variant="body1">{open?._source?.type}</Typography>
                  </Paper>
                </Box>

                {open?._source && <FieldTable data={open?._source} />}
              </Box>
            </>
          )}
        </Scrollbars>
      </Drawer>
    </>
  );
}

function Row({ style, active, onClick, children }: any) {
  return (
    <Box
      style={style}
      sx={{
        height: 24,
        p: 1,
        cursor: "pointer",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        overflow: "hidden",
        whiteSpace: "no-wrap",
        background: (theme) => (active ? theme.palette.grey[900] : ""),
        ":hover": {
          background: (theme) => theme.palette.grey[900],
        },
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}

function getMessage(source?: any) {
  return source?.["@m"] ?? source?.RenderedMessage ?? source?.msg ?? source?.message;
}

function getException(source?: any) {
  return source?.["@x"] ?? source?.Exception ?? source?.exception;
}

function getLevel(source?: any) {
  return source?.Level ?? source?.level;
}

export default LogsPage;
