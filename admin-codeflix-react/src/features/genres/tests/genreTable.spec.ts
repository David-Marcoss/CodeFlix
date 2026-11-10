import "@testing-library/jest-dom";
import { createElement } from "react";
import GenreTable, { type GenreTableProps } from "../components/genreTable";
import { renderWithProviders } from "../../../shared/utils/test-utils";

const props: GenreTableProps = {
  data: [
    {
      genre_id: "1",
      name: "John Doe",
      categories_id: ["1", "2"],
      categories: [
        {
          category_id: "20df54a0-5901-4927-8308-83a4ab946d68",
          name: "aventura",
          description: "Categoria de aventura",
          is_active: true,
          created_at: "2026-10-30T14:18:28.000Z",
        },
        {
          category_id: "3e5fe033-7f48-4584-8e19-a12ec2502650",
          name: "animação",
          description: "Categoria de animação",
          is_active: true,
          created_at: "2026-10-30T14:18:22.000Z",
        },
      ],
      is_active: true,
      created_at: "2023-01-01T00:00:00Z",
    },
  ],
  rowCount: 1,
  isFetching: false,
  page: 1,
  perPage: 10,
  pageSizeOptions: [5, 10, 20],
  onFilterModelChange: jest.fn(),
  onPaginationModelChange: jest.fn(),
  handleDeleteGenre: jest.fn(),
};

test("renderiza a tabela de membros", () => {
  const { asFragment, getByText } = renderWithProviders(createElement(GenreTable, props));

  expect(asFragment()).toMatchSnapshot();

  const nameCell = getByText("John Doe");
  expect(nameCell).toBeInTheDocument();

  const categoriesCell = getByText("aventura, animação");
  expect(categoriesCell).toBeInTheDocument();
});
