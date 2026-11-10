import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface MultipleSelectProps {
  values: { value: string; label: string }[];
  selectedValues?: string[];
  label: string;
  onValuesChange: (values: string[]) => void;
}

export default function MultipleSelect({
  values,
  selectedValues = [],
  label,
  onValuesChange,
}: MultipleSelectProps) {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    onValuesChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) =>
            values
              .filter((v) => selected.includes(v.value))
              .map((v) => v.label)
              .join(", ")
          }
        >
          {values.map((value) => {
            const selected = selectedValues.includes(value.value);
            const SelectionIcon = selected
              ? CheckBoxIcon
              : CheckBoxOutlineBlankIcon;

            return (
              <MenuItem key={value.value} value={value.value}>
                <SelectionIcon
                  fontSize="small"
                  style={{
                    marginRight: 8,
                    padding: 9,
                    boxSizing: "content-box",
                  }}
                />
                <ListItemText primary={value.label} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
