import { Typography } from "@mui/material";
import { Box } from "@mui/system";

function FieldTable({ data }: { data: any }) {
  // const fields = createFields(data);

  return (
    <Box sx={{ p: 4 }}>
      <table>
        <tbody>
          <ObjectMap data={data} depth={0} />

          {/* {fields.map((x) => (
            <Box component="tr">
              <Box
                component="td"
                sx={{
                  borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
                  verticalAlign: "top",
                }}
              >
                <Box sx={{ pl: x.depth * 16, pr: 16, verticalAlign: "top" }}>{x.key}</Box>
              </Box>
              <Box
                component="td"
                sx={{
                  borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
                  verticalAlign: "top",
                }}
              >
                <Box sx={{ whiteSpace: "pre-wrap", wordBreak: "break-all", verticalAlign: "top" }}>
                  {x.type === "object"}
                  {x.value}
                </Box>
              </Box>
            </Box>
          ))} */}
        </tbody>
      </table>
    </Box>
  );
}

function Row({
  depth,
  label,
  children,
}: {
  depth: number;
  label: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Box component="tr">
      <Box
        component="td"
        sx={{
          // borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
          verticalAlign: "top",
        }}
      >
        <Box sx={{ pl: depth * 16, pr: 16, verticalAlign: "top" }}>{label}</Box>
      </Box>
      <Box
        component="td"
        sx={{
          // borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
          verticalAlign: "top",
        }}
      >
        <Box sx={{ whiteSpace: "pre-wrap", wordBreak: "break-all", verticalAlign: "top" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function ObjectMap({ data, depth }: { data: any; depth: number }) {
  return (
    <td colSpan={2}>
      <table>
        <tbody>
          {Object.keys(data).map((key) => {
            if (data[key] === null) {
              return (
                <Row
                  depth={depth}
                  label={
                    <Typography component="span" color="primary">
                      {key}
                    </Typography>
                  }
                >
                  null
                </Row>
              );
            } else if (typeof data[key] === "string") {
              return (
                <Row
                  depth={depth}
                  label={
                    <Typography component="span" color="primary">
                      {key}
                    </Typography>
                  }
                >
                  {data[key]}
                </Row>
              );
            } else if (typeof data[key] === "number") {
              return (
                <Row
                  depth={depth}
                  label={
                    <Typography component="span" color="primary">
                      {key}
                    </Typography>
                  }
                >
                  {"" + data[key]}
                </Row>
              );
            } else if (Array.isArray(data[key])) {
              return (
                <>
                  <Row
                    depth={depth}
                    label={
                      <>
                        <Typography component="span" color="primary">
                          {key}
                        </Typography>
                        <Typography component="span" color="text.secondary" sx={{ paddingLeft: 8 }}>
                          {"["}
                        </Typography>
                      </>
                    }
                  ></Row>

                  <ObjectMap data={data[key]} depth={depth + 1} />

                  <Row
                    depth={depth}
                    label={
                      <>
                        <Typography component="span" color="text.secondary">
                          ]
                        </Typography>
                      </>
                    }
                  ></Row>
                </>
              );
            } else if (typeof data[key] === "object") {
              return (
                <>
                  <Row
                    depth={depth}
                    label={
                      <>
                        <Typography component="span" color="primary">
                          {key}
                        </Typography>
                        <Typography component="span" color="text.secondary" sx={{ paddingLeft: 8 }}>
                          {"{"}
                        </Typography>
                      </>
                    }
                  ></Row>

                  <ObjectMap data={data[key]} depth={depth + 1} />

                  <Row
                    depth={depth}
                    label={
                      <>
                        <Typography component="span" color="text.secondary">
                          {"}"}
                        </Typography>
                      </>
                    }
                  ></Row>
                </>
              );
            } else {
              return (
                <Row
                  label={
                    <Typography component="span" color="primary">
                      {key}
                    </Typography>
                  }
                  depth={depth}
                >
                  unknown
                </Row>
              );
            }
          })}
        </tbody>
      </table>
    </td>
  );
}

export default FieldTable;
