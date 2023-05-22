import React from "react";
import CategorySelector from "./CategorySelector";
import CardBrowser from "./CardBrowser";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardCategoryBrowser() {
    const { categories, selectedCategories,
            setSelectedCategories } = useCategories();

    const onCheck = checkedKeysValues => {
        console.log(checkedKeysValues);
        setSelectedCategories(checkedKeysValues);
    };

    return (
        <>
	  <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onCheck={onCheck}
          />
          {/* <CardBrowser/> */}
        </>
    );
}
