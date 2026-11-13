import { apiSlice } from "../api/apiSlice";
import type {
  Video,
  VideosList,
  CreateVideo,
  GetVideoById,
  UpdateVideo,
} from "../../shared/types/videos";
import type { SearchParams } from "../../shared/types/searchParams";

export function formatSearchParams(params: SearchParams) {
  const { page, perPage, search } = params;
  const searchParams = new URLSearchParams();

  searchParams.append("per_page", perPage?.toString() ?? "10");
  searchParams.append("page", page?.toString() ?? "1");
  searchParams.append("filter[title]", search ?? "");

  return searchParams.toString();
}

const deleteVideoQueryMutation = (video: { id: string }) => {
  return {
    url: `${route}/${video.id}`,
    method: "DELETE",
  };
};

const getVideosQuery = (params: SearchParams) => {
  console.log("getVideosQuery", `${route}?${formatSearchParams(params)}`);
  return {
    url: `${route}?${formatSearchParams(params)}`,
    method: "GET",
  };
};

const getVideoByIdQuery = (id: string) => {
  return {
    url: `${route}/${id}`,
    method: "GET",
  };
};

const createVideosQuery = (data: CreateVideo) => {
  return {
    url: route,
    method: "POST",
    body: data,
  };
};

const updateVideosQuery = (data: UpdateVideo) => {
  const { id, ...rest } = data;
  return {
    url: `${route}/${id}`,
    method: "PATCH",
    body: rest,
  };
};

const route = "/videos";

const videoApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    createVideo: mutation<Video, CreateVideo>({
      query: createVideosQuery,
      invalidatesTags: ["Videos"],
    }),
    updateVideo: mutation<Video, UpdateVideo>({
      query: updateVideosQuery,
      invalidatesTags: ["Videos"],
    }),
    getVideoById: query<GetVideoById, string>({
      query: getVideoByIdQuery,
      providesTags: ["Videos"],
    }),
    getVideos: query<VideosList, SearchParams>({
      query: getVideosQuery,
      providesTags: ["Videos"],
    }),
    deleteVideo: mutation<void, { id: string }>({
      query: deleteVideoQueryMutation,
      invalidatesTags: ["Videos"],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useDeleteVideoMutation,
  useCreateVideoMutation,
  useGetVideoByIdQuery,
  useUpdateVideoMutation,
} = videoApiSlice;
