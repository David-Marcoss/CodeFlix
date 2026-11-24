import { Box, Button, Link, IconButton, TextField } from "@mui/material";
import { useEffect, useId, useRef, type Ref } from "react";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Delete } from "@mui/icons-material";

interface FileInputProps {
  onAddFiles: (files: FileList | null) => void;
  value?: File;
  existingUrl?: string;
  onRemoveUploaded?: () => void;
  name?: string;
  label: string;
  accept?: string;
  disabled?: boolean;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: boolean;
  helperText?: string;
}

export default function FileInput({
  onAddFiles,
  value,
  existingUrl,
  onRemoveUploaded,
  name,
  label,
  accept = "*",
  disabled,
  onBlur,
  inputRef,
  error,
  helperText,
}: FileInputProps) {
  const id = useId();
  const htmlFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!value && htmlFileInputRef.current) {
      htmlFileInputRef.current.value = "";
    }
  }, [value]);

  const handleClearFiles = () => {
    if (htmlFileInputRef.current) htmlFileInputRef.current.value = "";
    onAddFiles(null);
  };

  return (
    <div>
      <TextField
        label={label}
        placeholder="Selecione um arquivo"
        value={value?.name ?? (existingUrl ? "Arquivo enviado" : "")}
        fullWidth
        disabled={disabled}
        error={error}
        helperText={helperText}
        onBlur={onBlur}
        slotProps={{
          htmlInput: { readOnly: true },
          input: {
            endAdornment: (
              <IconButton
                type="button"
                color="primary"
                sx={{ ml: 1 }}
                aria-label={`${value ? "Remover" : "Selecionar"} ${label}`}
                disabled={disabled}
                onClick={value ? handleClearFiles : () => htmlFileInputRef.current?.click()}
              >
                {value ? <Delete /> : <AttachmentIcon />}
              </IconButton>
            ),
          },
        }}
      />
      {existingUrl && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <Link href={existingUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visualizar ${label}`}>
            Visualizar arquivo enviado
          </Link>
          <Button type="button" color="error" disabled={disabled} onClick={onRemoveUploaded} aria-label={`Excluir ${label} enviado`}>
            Excluir arquivo enviado
          </Button>
        </Box>
      )}
      <input
        id={id}
        name={name}
        aria-label={`Arquivo ${label}`}
        accept={accept}
        type="file"
        disabled={disabled}
        ref={element => {
          htmlFileInputRef.current = element;
          if (typeof inputRef === "function") inputRef(element);
          else if (inputRef) inputRef.current = element;
        }}
        onBlur={onBlur}
        onChange={event => onAddFiles(event.target.files)}
        style={{ display: "none" }}
      />
    </div>
  );
}
