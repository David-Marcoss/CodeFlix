import "@testing-library/jest-dom";
import { createElement } from "react";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import CategoriesList from "../CategoriesList";

test("renderiza a lista de categorias", () => {
  const { asFragment } = renderWithProviders(createElement(CategoriesList));

  expect(asFragment()).toMatchSnapshot();
});
