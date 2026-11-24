import * as React from "react"
import type { LinearProgressProps } from "@mui/material/LinearProgress"
import LinearProgress from "@mui/material/LinearProgress"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export function UploadProgress({
  label,
  status,
  ...props
}: LinearProgressProps & {
  value: number
  label: string
  status?: "idle" | "loading" | "success" | "failed" | "cancelled"
}) {
  const progressId = React.useId()
  return (
    <div style={{ width: "100%" }}>
      <Typography id={progressId} variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant={
              status === "loading" && props.value >= 100
                ? "indeterminate"
                : "determinate"
            }
            color={
              status === "failed"
                ? "error"
                : status === "success"
                  ? "success"
                  : "primary"
            }
            aria-labelledby={progressId}
            {...props}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" role="status">
        {status === "success"
          ? "Concluído"
          : status === "failed"
            ? "Falha no upload"
            : status === "cancelled"
              ? "Cancelado"
              : props.value >= 100
                ? "Processando no servidor…"
                : "Enviando…"}
      </Typography>
    </div>
  )
}
