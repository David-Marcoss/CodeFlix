import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import type {
  CastMember,
  CastMemberList,
  CreateCastMember,
  GetCastMemberById,
  UpdateCastMember,
} from "../../shared/types/castMember";
import type { SearchParams } from "../../shared/types/searchParams";
import { formatSearchParams } from "../../shared/utils/formatSearchParams";

const castMemberSlice = createSlice({
  name: "castMember",
  initialState: [],
  reducers: {},
});

const deleteCastMemberQueryMutation = (castMember: {
  cast_member_id: string;
}) => {
  return {
    url: `${route}/${castMember.cast_member_id}`,
    method: "DELETE",
  };
};

const getCastMembersQuery = (params: SearchParams) => {
  return {
    url: `${route}?${formatSearchParams(params)}`,
    method: "GET",
  };
};

const getCastMemberByIdQuery = (id: string) => {
  return {
    url: `${route}/${id}`,
    method: "GET",
  };
};

const createCastMembersQuery = (data: CreateCastMember) => {
  return {
    url: route,
    method: "POST",
    body: data,
  };
};

const updateCastMembersQuery = (data: UpdateCastMember) => {
  const { cast_member_id, ...rest } = data;
  return {
    url: `${route}/${cast_member_id}`,
    method: "PATCH",
    body: rest,
  };
};

const route = "/cast-member";
const castMemberApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    createCastMember: mutation<CastMember, CreateCastMember>({
      query: createCastMembersQuery,
      invalidatesTags: ["CastMembers"],
    }),
    updateCastMember: mutation<CastMember, UpdateCastMember>({
      query: updateCastMembersQuery,
      invalidatesTags: ["CastMembers"],
    }),
    getCastMemberById: query<GetCastMemberById, string>({
      query: getCastMemberByIdQuery,
      providesTags: ["CastMembers"],
    }),
    getCastMembers: query<CastMemberList, SearchParams>({
      query: getCastMembersQuery,
      providesTags: ["CastMembers"],
    }),
    deleteCastMember: mutation<void, { cast_member_id: string }>({
      query: deleteCastMemberQueryMutation,
      invalidatesTags: ["CastMembers"],
    }),
  }),
});

export default castMemberSlice.reducer;

export const {
  useGetCastMembersQuery,
  useDeleteCastMemberMutation,
  useCreateCastMemberMutation,
  useGetCastMemberByIdQuery,
  useUpdateCastMemberMutation,
} = castMemberApiSlice;
