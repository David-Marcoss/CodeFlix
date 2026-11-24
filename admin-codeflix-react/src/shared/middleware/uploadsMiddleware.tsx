import { createListenerMiddleware } from "@reduxjs/toolkit"
import { updateVideo } from "../../features/uploads/uploadThunk"
import { addVideoFile, cancelUpload } from "../../features/uploads/uploadSlice"

const uploadsQueeMiddleware = createListenerMiddleware()
uploadsQueeMiddleware.startListening({
  actionCreator: addVideoFile,
  effect: async (action, listenerApi) => {
    const task = listenerApi.dispatch(updateVideo(action.payload))
    const unsubscribe = uploadsQueeMiddleware.startListening({
      actionCreator: cancelUpload,
      effect: cancelAction => {
        if (cancelAction.payload.id === action.payload.id) task.abort()
      },
    })
    try {
      await task
    } finally {
      unsubscribe()
    }
  },
})
export { uploadsQueeMiddleware }
