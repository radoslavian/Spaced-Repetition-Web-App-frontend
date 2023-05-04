import React from "react";
import { Tree } from "antd";

export default function CategoryBrowser({ categories, selectedCategories }) {
    return (
        <>
          <Tree
            checkable
            defaultSelectedKeys={selectedCategories}
            defaultCheckedKeys={selectedCategories}
            treeData={categories}
            defaultExpandAll={true}
          />
        </>
    );
}
