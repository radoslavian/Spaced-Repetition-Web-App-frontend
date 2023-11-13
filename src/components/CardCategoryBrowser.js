import CategorySelector from "./CategorySelector";
import { useCategories } from "../contexts/CategoriesProvider";

// this will be renamed to CategoryBrowser
export default function CardCategoryBrowser () {
    const { categories, selectedCategories,
            setSelectedCategories } = useCategories();
    const onCategoryCheck = checkedKeysValues =>
          setSelectedCategories(checkedKeysValues);

    return (
        <>
	  <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onCheck={onCategoryCheck}
          />
        </>
    );
}

