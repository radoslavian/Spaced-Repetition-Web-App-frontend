import React from "react";
import { Tree } from "antd";

export default function CategorySelector(
    { categories, selectedCategories, onCheck }) {
    return (
        <>
          <Tree
            checkable
            checkedKeys={selectedCategories}
            treeData={categories}
            defaultExpandAll={true}
            onCheck={onCheck}
            defaultExpandedKeys={categories}
          />
        </>
    );
}
