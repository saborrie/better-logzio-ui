import { Chip } from "@mui/material";
import { useSearchParams } from "react-router-dom";

function FilterTags() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTypes = searchParams.getAll("type");

  return (
    <>
      {selectedTypes.map((type) => (
        <Chip
          key={type}
          sx={{ ml: 2 }}
          label={`Type: ${type}`}
          onDelete={() =>
            setSearchParams({ type: selectedTypes.filter((x) => x != type) }, { replace: true })
          }
        />
      ))}
    </>
  );
}

export default FilterTags;
