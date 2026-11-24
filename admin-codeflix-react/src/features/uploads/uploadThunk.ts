import axios from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateFileProgress, type UploadState } from "./uploadSlice"
import { uploadProgress, uploadVideoService } from "./uploadService"
import { apiSlice } from "../api/apiSlice"

export const updateVideo = createAsyncThunk(
  "uploads/uploadVideos",
  async (data: UploadState, thunkAPI) => {
    try {
    await uploadVideoService({
      ...data,
      signal: thunkAPI.signal,
      onUploadProgress: event => {
        thunkAPI.dispatch(
          updateFileProgress({ id: data.id, progress: uploadProgress(event) }),
        )
      },
    })
    thunkAPI.dispatch(apiSlice.util.invalidateTags(["Videos"]))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        return thunkAPI.rejectWithValue(
          typeof message === "string" ? message : Array.isArray(message) ? message.join("; ") : "Não foi possível enviar o arquivo.",
        )
      }
      throw error
    }
  },
)
