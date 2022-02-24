import { Chip } from "@mui/material";
import { useSearchParams } from "react-router-dom";

function FilterTags() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedItems: Record<string, string[]> = {
    type: searchParams.getAll("type"),
    level: searchParams.getAll("level"),
  };

  return (
    <>
      {["type", "level"].map((group) => (
        <>
          {selectedItems[group].map((tag) => (
            <Chip
              key={tag}
              sx={{ ml: 2 }}
              label={`${group}: ${tag}`}
              onDelete={() =>
                setSearchParams(
                  { ...selectedItems, [group]: selectedItems[group].filter((x) => x != tag) },
                  { replace: true }
                )
              }
            />
          ))}
        </>
      ))}
    </>
  );
}

export default FilterTags;
