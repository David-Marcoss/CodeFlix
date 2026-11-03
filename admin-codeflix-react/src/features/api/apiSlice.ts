import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Enviroment } from "../../shared/environments/environment";


const baseUrl = Enviroment.API_URL;

// configura a comunicação com API externa e gerencia os estados dos dados das requisições
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Categories", "CastMembers"],
  endpoints: (builder) => ({}),
  baseQuery: fetchBaseQuery({ baseUrl }),
});
