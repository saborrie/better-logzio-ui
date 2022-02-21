import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "react-query";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSearch } from "../services/api";

function Sidebar() {
  const { timeRange } = useParams();
  const search = useSearch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const aggregationsQuery = useQuery(["search", timeRange], async () => {
    return await search(timeRange);
  });

  if (aggregationsQuery.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading...
      </Typography>
    );
  }
  if (aggregationsQuery.isError) {
    return (
      <Typography variant="body2" color="error">
        Error: {aggregationsQuery.error}
      </Typography>
    );
  }

  const selectedTypes = searchParams.getAll("type");

  return (
    <>
      {aggregationsQuery.data?.aggregations.byType?.buckets.map((typeBucket) => {
        const active = selectedTypes.includes(typeBucket.key);

        return (
          <Box
            key={typeBucket.key}
            onClick={() => {
              if (active) {
                setSearchParams(
                  { type: selectedTypes.filter((x) => x != typeBucket.key) },
                  { replace: true }
                );
              } else {
                setSearchParams({ type: [...selectedTypes, typeBucket.key] }, { replace: true });
              }
            }}
            sx={{
              p: 1,
              position: "relative",
              cursor: "pointer",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              background: (theme) => (active ? theme.palette.grey[900] : ""),
              ":hover": {
                background: (theme) => theme.palette.grey[900],
                "& .only": {
                  display: "block",
                },
              },
            }}
          >
            {typeBucket.key} ({typeBucket.doc_count})
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
                setSearchParams({ type: [typeBucket.key] }, { replace: true });
              }}
            >
              Only
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default Sidebar;
