import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup, { type RadioGroupProps } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { type RatingValues } from "../../../shared/types/videos";
import { FormHelperText } from "@mui/material";
import { Ratting } from "./ratting";
import { ratingOptions } from "../utils/rattingOptions";

type RattingInputProps = {
  value: RatingValues;
  name: string;
  onChange: RadioGroupProps["onChange"];
  onBlur: RadioGroupProps["onBlur"];
  inputRef?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
};

export default function RattingInput({
  value,
  name,
  onChange,
  onBlur,
  inputRef,
  disabled,
  error,
  helperText,
}: RattingInputProps) {
  const id = React.useId();
  return (
    <FormControl disabled={disabled} error={error}>
      <FormLabel id={`${id}-label`}>Classificação Indicativa</FormLabel>
      <RadioGroup
        row
        aria-labelledby={`${id}-label`}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-describedby={helperText ? `${id}-helper-text` : undefined}
      >
        {ratingOptions.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={
              <Radio
                slotProps={{
                  input: { ref: item.value === value ? inputRef : undefined },
                }}
              />
            }
            label={<Ratting label={item.label} color={item.color} />}
          />
        ))}
      </RadioGroup>
      {helperText && (
        <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
