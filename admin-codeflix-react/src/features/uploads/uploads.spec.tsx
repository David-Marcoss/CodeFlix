import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { uploadReducer, addVideoFile, updateFileProgress } from "./uploadSlice"
import { UploadList } from "./UploadList"
import { uploadsQueeMiddleware } from "../../shared/middleware/uploadsMiddleware"
import { uploadVideoService } from "./uploadService"
import { apiSlice } from "../api/apiSlice"

jest.mock("./uploadService", () => ({
  uploadVideoService: jest.fn(),
  uploadProgress: () => 50,
}))
const file = new File(["image"], "image.png", { type: "image/png" })
const upload = { id: "first", videoId: "video", field: "thumbnail", file }

it("updates only the matching file", () => {
  let state = uploadReducer(undefined, addVideoFile(upload))
  state = uploadReducer(state, addVideoFile({ ...upload, id: "second" }))
  state = uploadReducer(
    state,
    updateFileProgress({ id: "first", progress: 42 }),
  )
  expect(state.map(item => item.progress)).toEqual([42, 0])
})

it("clears completed uploads while preserving failed and active entries", () => {
  const store = configureStore({
    reducer: { uploads: uploadReducer },
    middleware: getDefault => getDefault({ serializableCheck: false }),
    preloadedState: {
      uploads: [
        { ...upload, status: "success" as const },
        { ...upload, id: "failed", status: "failed" as const },
        { ...upload, id: "active", status: "loading" as const },
      ],
    },
  })
  render(
    <Provider store={store}>
      <UploadList />
    </Provider>,
  )
  fireEvent.click(screen.getByText("Uploads"))
  fireEvent.click(screen.getByRole("button", { name: "Limpar concluídos" }))
  expect(store.getState().uploads.map(item => item.id)).toEqual([
    "failed",
    "active",
  ])
})

it("cancels the HTTP request and records cancellation instead of failure", async () => {
  let signal: AbortSignal
  jest.mocked(uploadVideoService).mockImplementation(params => {
    signal = params.signal
    return new Promise((_resolve, reject) =>
      params.signal.addEventListener("abort", () =>
        reject(new Error("aborted")),
      ),
    )
  })
  const store = configureStore({
    reducer: {
      uploads: uploadReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefault =>
      getDefault({ serializableCheck: false })
        .prepend(uploadsQueeMiddleware.middleware)
        .concat(apiSlice.middleware),
  })
  store.dispatch(addVideoFile(upload))
  expect(store.getState().uploads[0].status).toBe("loading")
  render(
    <Provider store={store}>
      <UploadList />
    </Provider>,
  )
  fireEvent.click(screen.getByText("Uploads"))
  fireEvent.click(
    screen.getByRole("button", { name: "Cancelar upload de image.png" }),
  )
  await waitFor(() =>
    expect(store.getState().uploads[0].status).toBe("cancelled"),
  )
  expect(signal!.aborted).toBe(true)
})

it("marks a failed request as failed", async () => {
  jest
    .mocked(uploadVideoService)
    .mockRejectedValueOnce(new Error("network failure"))
  const store = configureStore({
    reducer: {
      uploads: uploadReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefault =>
      getDefault({ serializableCheck: false })
        .prepend(uploadsQueeMiddleware.middleware)
        .concat(apiSlice.middleware),
  })
  store.dispatch(addVideoFile(upload))
  await waitFor(() => expect(store.getState().uploads[0].status).toBe("failed"))
})

it("displays the API error for a rejected banner upload", async () => {
  const message = "Invalid media file size: 3145728 > 2097152"
  jest.mocked(uploadVideoService).mockRejectedValueOnce({ isAxiosError: true, response: { data: { message } } })
  const store = configureStore({
    reducer: { uploads: uploadReducer, [apiSlice.reducerPath]: apiSlice.reducer },
    middleware: getDefault => getDefault({ serializableCheck: false }).prepend(uploadsQueeMiddleware.middleware).concat(apiSlice.middleware),
  })
  store.dispatch(addVideoFile({ ...upload, field: "banner" }))
  await waitFor(() => expect(store.getState().uploads[0].error).toBe(message))
  render(<Provider store={store}><UploadList /></Provider>)
  fireEvent.click(screen.getByText("Uploads"))
  expect(screen.getByRole("alert")).toHaveTextContent(message)
})
