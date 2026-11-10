import "@testing-library/jest-dom";
import { createElement } from "react";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import type { GenreFormProps } from "../components/genreForm";
import GenreForm from "../components/genreForm";

const categories = [
  {
    category_id: "1",
    name: "aventura",
    description: "Categoria de aventura",
    is_active: true,
    created_at: "2026-10-30T14:18:28.000Z",
  },
];

const props: GenreFormProps = {
  genre: {
    genre_id: "1",
    name: "John Doe",
    categories_id: ["1"],
    categories,
    is_active: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  categories: categories.map((cat) => ({
    value: cat.category_id,
    label: cat.name,
  })),
  handleCategoriesChange: jest.fn(),
  isLoading: false,
  isDisabled: false,
  handleSubmit: jest.fn(),
  handleInputChange: jest.fn(),
  handleInputToggleChange: jest.fn(),
};

test("renderiza o formulário de membros", () => {
  const { asFragment } = renderWithProviders(createElement(GenreForm, props));

  expect(asFragment()).toMatchSnapshot();
});
