import { Route, Routes } from "react-router-dom";
import CategoriesList from "../features/categories/CategoriesList";
import CategoriesCreate from "../features/categories/CategoriesCreate";
import CategoriesEdit from "../features/categories/CategoriesEdit";

const RoutesApp = () => {
  return (
    <Routes>
      <Route Component={() => <>Teste</>} path="/" />

      <Route path="/categories">
        <Route Component={CategoriesList} path="" />
        <Route Component={CategoriesCreate} path="create" />
        <Route Component={CategoriesEdit} path="edit/:id" />
      </Route>
    </Routes>
  );
};

export default RoutesApp;
