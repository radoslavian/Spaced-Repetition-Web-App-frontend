import React from "react";
import { Tree } from "antd";
import { extractCategoryKeys } from "../utils/helpers";

export default function CategorySelector(
    { categories, selectedCategories, onCheck }) {
    const expandedCategoriesKeys = extractCategoryKeys(categories);

    return (
        <>
          <h4>Categories:</h4>
          <Tree
            checkable
            checkedKeys={selectedCategories}
            treeData={categories}
            defaultExpandAll={true}
            onCheck={onCheck}
            expandedKeys={expandedCategoriesKeys}
          />
        </>
    );
}
