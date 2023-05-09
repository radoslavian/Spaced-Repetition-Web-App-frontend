import { render, screen, act, fireEvent } from "@testing-library/react";
import CategorySelector from "./components/CategorySelector.js";
import { UserProvider, useUser } from "./contexts/UserProvider";
import { ApiProvider, useApi } from "./contexts/ApiProvider";
import { CategoriesProvider, useCategories } from "./contexts/CategoriesProvider";
import { userCategories2 as userCategories } from "./__mocks__/mockData";
import CardCategoryBrowser from "./components/CardCategoryBrowser";
import axios, { axiosMatch } from "axios";

describe("CategorySelector tests.", () => {
    beforeAll(() => render(
        <CategorySelector
          categories={userCategories.categories}
          selectedCategories={userCategories.selected_categories}
        />
    ));

    test("if a given text got rendered into a page", () => {
        const categoryName = screen.getByText("Household devices");
        expect(categoryName).toBeInTheDocument();
    });
});

describe("<CardCategoryBrowser/>", () => {
    beforeAll(async () => act(async () => render(
        <ApiProvider>
          <UserProvider>
            <CategoriesProvider>
              <CardCategoryBrowser/>
            </CategoriesProvider>
          </UserProvider>
        </ApiProvider>
    )));

    test("if clicking category sends selected categories to the server",
         () => {
             // how to perform this test?
    });
});
