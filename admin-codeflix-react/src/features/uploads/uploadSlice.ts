import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { updateVideo } from "./uploadThunk"

export interface UploadState {
  id: string
  videoId: string
  field: string
  file: File
  progress?: number
  status?: "idle" | "success" | "failed" | "loading" | "cancelled"
  error?: string
}

export interface UpdateFileProgress {
  id: string
  progress: number
}

const initialState: UploadState[] = []

const uploadSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    addVideoFile: (state, action) => {
      state.push({ ...action.payload, status: "idle", progress: 0 })
    },
    removeVideoFile: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter(upload => upload.id !== action.payload.id)
    },
    clearCompletedUploads: state =>
      state.filter(upload => upload.status !== "success"),
    cancelUpload: (_state, _action: PayloadAction<{ id: string }>) => {},
    updateFileProgress: (state, action: PayloadAction<UpdateFileProgress>) => {
      const file = state.find(upload => upload.id === action.payload.id)

      if (file) {
        file.progress = action.payload.progress
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(updateVideo.pending, (state, action) => {
      const upload = state.find(upload => upload.id === action.meta.arg.id)
      if (upload) {
        upload.status = "loading"
      }
    })

    builder.addCase(updateVideo.fulfilled, (state, action) => {
      const upload = state.find(upload => upload.id === action.meta.arg.id)
      if (upload) {
        upload.status = "success"
        upload.progress = 100
      }
    })

    builder.addCase(updateVideo.rejected, (state, action) => {
      const upload = state.find(upload => upload.id === action.meta.arg.id)
      if (upload) {
        upload.status = action.meta.aborted ? "cancelled" : "failed"
        upload.error = action.meta.aborted ? undefined : typeof action.payload === "string" ? action.payload : action.error.message
      }
    })
  },
})

export const selectUploads = (state: RootState) => state.uploads

export const {
  addVideoFile,
  clearCompletedUploads,
  cancelUpload,
  removeVideoFile,
  updateFileProgress,
} = uploadSlice.actions

export const uploadReducer = uploadSlice.reducer
