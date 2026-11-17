import * as React from "react"
import Radio from "@mui/material/Radio"
import RadioGroup, { type RadioGroupProps } from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { ratingValues, type RatingValues } from "../../../shared/types/videos"
import { Box, FormHelperText, Typography } from "@mui/material"

const ratingOptions = [
  { value: ratingValues.RL, label: "L", color: "green" },
  { value: ratingValues.R10, label: "10", color: "blue" },
  { value: ratingValues.R12, label: "12", color: "#ffd900" },
  { value: ratingValues.R14, label: "14", color: "orange" },
  { value: ratingValues.R16, label: "16", color: "red" },
  { value: ratingValues.R18, label: "18", color: "black" },
]

const Ratting = ({ label, color }: { label: string; color: string }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      backgroundColor: color,
      color: "white",
    }}
  >
    <Typography>{label}</Typography>
  </Box>
)

type RattingInputProps = {
  value: RatingValues
  name: string
  onChange: RadioGroupProps["onChange"]
  onBlur: RadioGroupProps["onBlur"]
  inputRef?: React.Ref<HTMLInputElement>
  disabled?: boolean
  error?: boolean
  helperText?: string
}

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
  const id = React.useId()
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
        {ratingOptions.map(item => (
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
  )
}
