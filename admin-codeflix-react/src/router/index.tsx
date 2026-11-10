import { Route, Routes } from "react-router-dom";
import CategoriesList from "../features/categories/CategoriesList";
import CategoriesCreate from "../features/categories/CategoriesCreate";
import CategoriesEdit from "../features/categories/CategoriesEdit";
import CastMembersList from "../features/castMembers/CastMemberList";
import CastMembersCreate from "../features/castMembers/CastMemberCreate";
import CastMembersEdit from "../features/castMembers/CastMemberEdit";
import GenreList from "../features/genres/GenreList";
import GenreCreate from "../features/genres/GenreCreate";

const RoutesApp = () => {
  return (
    <Routes>
      <Route Component={() => <>Teste</>} path="/" />

      <Route path="/categories">
        <Route Component={CategoriesList} path="" />
        <Route Component={CategoriesCreate} path="create" />
        <Route Component={CategoriesEdit} path="edit/:id" />
      </Route>

      <Route path="/cast-members">
        <Route Component={CastMembersList} path="" />
        <Route Component={CastMembersCreate} path="create" />
        <Route Component={CastMembersEdit} path="edit/:id" />
      </Route>

      <Route path="/genres">
        <Route Component={GenreList} path="" />
        <Route Component={GenreCreate} path="create" />
        <Route Component={CastMembersEdit} path="edit/:id" />
      </Route>
    </Routes>
  );
};

export default RoutesApp;
