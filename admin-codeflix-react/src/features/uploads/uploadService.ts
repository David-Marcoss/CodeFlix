import { getAccessToken } from "../../shared/auth/keycloackConfig"
import { Enviroment } from "../../shared/environments/environment"
import type { UploadState } from "./uploadSlice"
import axios, { type AxiosProgressEvent } from "axios"

interface UploadVideo extends UploadState {
  signal: AbortSignal
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
}

const apiEndponit = `${Enviroment.API_URL}/videos`

const formatData = (data: UploadState) => {
  const formData = new FormData()

  formData.append(data.field, data.file)

  return formData
}

export const uploadProgress = (progressEvent: AxiosProgressEvent) => {
  if (progressEvent.total) {
    const progress = (progressEvent.loaded * 100) / progressEvent.total
    return Math.round(progress * 100) / 100
  }
  return 0
}

// faz a chamada da api
export const uploadVideoService = async (params: UploadVideo) => {
  const { onUploadProgress, signal, ...rest } = params

  const token = await getAccessToken()
  const data = formatData(rest)
  return axios.patch(`${apiEndponit}/${params.videoId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    onUploadProgress,
    signal,
  })
}
