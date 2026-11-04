import "@testing-library/jest-dom";
import { createElement } from "react"; 
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import type { CategoriesFormProps } from "../components/cayegoriesForm";
import CategoriesForm from "../components/cayegoriesForm";

const props: CategoriesFormProps = {
  category: {
    category_id: "1",
    name: "John Doe",
    description: "A sample category",
    is_active: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  isLoading: false,
  isDisabled: false,
  handleSubmit: jest.fn(),
  handleInputChange: jest.fn(),
  handleInputToggleChange: jest.fn(),
};

test("renderiza o formulário de membros", () => {
  const { asFragment } = renderWithProviders(
    createElement(BrowserRouter, null, createElement(CategoriesForm, props)),
  );

  expect(asFragment()).toMatchSnapshot();
});
