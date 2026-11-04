import "@testing-library/jest-dom";
import { createElement } from "react";
import CategoryTable, { type CategoryTableProps } from "../components/categoriesTable";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../../shared/utils/test-utils";

const props: CategoryTableProps = {
  categories: [
    {
      category_id: "1",
      name: "John Doe",
      description: "A sample category",
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
};

test("renderiza a tabela de membros", () => {
  const { asFragment } = renderWithProviders(
    createElement(CategoryTable, props),
  );

  expect(asFragment()).toMatchSnapshot();
});
