import "@testing-library/jest-dom";
import { createElement } from "react";
import {
  CastMemberTable,
  type CastMemberTableProps,
} from "../components/CastMemberTable";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import type { CastMembersFormProps } from "../components/CastMemberForm";
import CastMembersForm from "../components/CastMemberForm";

const props: CastMembersFormProps = {
  castMember: {
    cast_member_id: "1",
    name: "John Doe",
    type: "actor",
    created_at: "2023-01-01T00:00:00Z",
  },
  isLoading: false,
  isDisabled: false,
  handleSubmit: jest.fn(),
  handleInputChange: jest.fn(),
  handleCastMemberTypeChange: jest.fn(),
};

test("renderiza o formulário de membros", () => {
  const { asFragment } = renderWithProviders(
    createElement(CastMembersForm, props),
  );

  expect(asFragment()).toMatchSnapshot();
});
