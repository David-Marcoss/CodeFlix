import "@testing-library/jest-dom";
import { createElement } from "react";
import {
  CastMemberTable,
  type CastMemberTableProps,
} from "../components/CastMemberTable";
import { renderWithProviders } from "../../../shared/utils/test-utils";

const props: CastMemberTableProps = {
  castMembers: [
    {
      cast_member_id: "1",
      name: "John Doe",
      type: "actor",
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
    createElement(CastMemberTable, props),
  );

  expect(asFragment()).toMatchSnapshot();
});
