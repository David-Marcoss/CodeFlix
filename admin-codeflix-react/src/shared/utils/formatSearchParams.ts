import type { SearchParams } from "../types/searchParams";

export function formatSearchParams(params: SearchParams) {
  const { page, perPage, search } = params;
  const searchParams = new URLSearchParams();

  searchParams.append("per_page", perPage?.toString() ?? "10");
  searchParams.append("page", page?.toString() ?? "1");
  searchParams.append("filter", search ?? "");

  return searchParams.toString();
}
