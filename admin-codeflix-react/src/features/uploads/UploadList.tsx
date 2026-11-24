import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  List,
  ListItem,
  Typography,
} from "@mui/material"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { UploadProgress } from "../../components/Progress"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectUploads,
  clearCompletedUploads,
  cancelUpload,
} from "./uploadSlice"

export function UploadList() {
  const uploads = useAppSelector(selectUploads)
  const dispatch = useAppDispatch()

  if (!uploads || uploads.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        position: "fixed",
        right: 0,
        bottom: 0,
        zIndex: 10,
        margin: 2,
        "@media (min-width: 600px)": { width: 450 },
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<GridExpandMoreIcon />}
          aria-controls={`upload-panel1-content`}
          id={`upload-panel1-header`}
        >
          <Typography component="span">Uploads</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            disabled={!uploads.some(upload => upload.status === "success")}
            onClick={() => dispatch(clearCompletedUploads())}
          >
            Limpar concluídos
          </Button>
          <List sx={{ maxHeight: 320, overflow: "auto" }}>
            {uploads.map(upload => (
              <ListItem key={upload.id} sx={{ display: "block" }}>
                <UploadProgress
                  label={upload.file.name}
                  value={upload.progress ?? 0}
                  status={upload.status}
                />
                {upload.status === "failed" && upload.error && (
                  <Typography role="alert" color="error" variant="body2">{upload.error}</Typography>
                )}
                {(upload.status === "loading" || upload.status === "idle") && (
                  <Button
                    onClick={() => dispatch(cancelUpload({ id: upload.id }))}
                    aria-label={`Cancelar upload de ${upload.file.name}`}
                  >
                    Cancelar
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
