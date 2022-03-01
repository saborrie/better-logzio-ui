import { Checkbox, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "react-query";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSearch } from "../services/api";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useToken } from "../services/auth";
function Sidebar() {
  const { timeRange } = useParams();
  const token = useToken();
  const search = useSearch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const aggregationsQuery = useQuery(["search", token, timeRange], async () => {
    return await search(timeRange);
  });

  if (aggregationsQuery.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading...
      </Typography>
    );
  }
  if (aggregationsQuery.isError || aggregationsQuery.data?.aggregations === null) {
    return (
      <Typography variant="body2" color="error">
        Error: {aggregationsQuery.error}
      </Typography>
    );
  }

  const selectedItems: Record<string, string[]> = {
    type: searchParams.getAll("type"),
    level: searchParams.getAll("level"),
  };

  return (
    <Box sx={{ p: 8 }}>
      {["type", "level"].map((agg) => (
        <Paper
          sx={{
            mb: 8,
            overflow: "hidden",

            // border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              pl: 4,
              pr: 4,
              borderTop: (theme) => `2px solid ${theme.palette.primary.dark}`,

              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="overline" color="text.secondary">
              {agg}
            </Typography>
          </Box>
          {aggregationsQuery.data?.aggregations?.[agg]?.buckets.map((bucket) => {
            const selectedBuckets = selectedItems[agg];

            const active = selectedBuckets.includes(bucket.key);

            return (
              <Box
                key={bucket.key}
                onClick={() => {
                  if (active) {
                    setSearchParams(
                      { ...selectedItems, [agg]: selectedBuckets.filter((x) => x != bucket.key) },
                      { replace: true }
                    );
                  } else {
                    setSearchParams(
                      { ...selectedItems, [agg]: [...selectedBuckets, bucket.key] },
                      { replace: true }
                    );
                  }
                }}
                sx={{
                  p: 2,
                  pl: 4,
                  pr: 4,
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  // background: (theme) => (active ? theme.palette.grey[900] : ""),
                  ":hover": {
                    background: (theme) => theme.palette.grey[900],
                    "& .only": {
                      display: "block",
                    },
                  },
                  ":last-child": {
                    borderBottom: "none",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mr: 2, flexShrink: 0 }}>
                  {active && <CheckBoxIcon sx={{ verticalAlign: "bottom" }} />}
                </Box>
                {bucket.key} ({bucket.doc_count})
                <Box
                  className="only"
                  sx={{
                    display: "none",
                    position: "absolute",
                    right: 8,
                    top: 0,
                    p: 1,
                    m: "1px",
                    ":hover": { textDecoration: "underline" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchParams({ ...selectedItems, [agg]: [bucket.key] }, { replace: true });
                  }}
                >
                  Only
                </Box>
              </Box>
            );
          })}
        </Paper>
      ))}
    </Box>
  );
}

export default Sidebar;
