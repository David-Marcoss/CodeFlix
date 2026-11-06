import type { Category, CategoryList } from "../types/category";

export const categoriesMock: Category[] = [
  {
    category_id: "e9d6d59e-15b8-4ffc-88df-7f7a9515e06c",
    name: "teste update",
    description: "sauble",
    is_active: false,
    created_at: "2026-10-30T14:57:18.000Z",
  },
  {
    category_id: "25bdf16d-9224-4ee1-9867-bade75d9f2be",
    name: "documentario ayualizado",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-30T14:18:37.000Z",
  },
  {
    category_id: "20df54a0-5901-4927-8308-83a4ab946d68",
    name: "aventura",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-30T14:18:28.000Z",
  },
  {
    category_id: "3e5fe033-7f48-4584-8e19-a12ec2502650",
    name: "animação",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-30T14:18:22.000Z",
  },
  {
    category_id: "96465f2e-1b51-46af-8a67-ccf9865310a6",
    name: "anime",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-30T14:18:13.000Z",
  },
  {
    category_id: "30b9631b-fbbb-48e4-ad74-395754c8415f",
    name: "drama",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-30T14:18:06.000Z",
  },
  {
    category_id: "6952e900-f31a-43ed-ad76-cd1457332388",
    name: "terror",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-30T13:36:43.000Z",
  },
  {
    category_id: "07029d4c-be5a-4d64-8955-f03bd5653eb2",
    name: "terror",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-29T17:09:49.000Z",
  },
  {
    category_id: "4c2204a8-609c-4d22-abc9-ae46f75fe62d",
    name: "comedia",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-29T17:09:43.000Z",
  },
  {
    category_id: "7be3ead9-3d61-443f-8de8-5d780cf4ff1c",
    name: "aventura",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-29T17:09:36.000Z",
  },
  {
    category_id: "ebb628f8-0901-4624-9806-b43ba17e6665",
    name: "ação",
    description: "djjnwejkdnk",
    is_active: true,
    created_at: "2026-10-29T17:09:30.000Z",
  },
];

export const categoriesListMock: CategoryList = {
  data: categoriesMock,
  meta: {
    current_page: 1,
    per_page: 15,
    last_page: 1,
    total: 11,
  },
};


export const categoriesListMockPage2: CategoryList = {
  data: [
    {
      category_id: "ebb628f8-0901-4624-9806-b43ba17e6665",
      name: "ação",
      description: "djjnwejkdnk",
      is_active: true,
      created_at: "2026-10-29T17:09:30.000Z",
    },
  ],
  meta: {
    current_page: 2,
    per_page: 10,
    last_page: 2,
    total: 11,
  },
};