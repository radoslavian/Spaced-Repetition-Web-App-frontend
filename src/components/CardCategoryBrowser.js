import React from "react";
import CategorySelector from "./CategorySelector";
import { useCards } from "../contexts/CardsProvider";
import CardBrowser from "./CardBrowser";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardCategoryBrowser() {
    const { categories, selectedCategories,
            setSelectedCategories } = useCategories();
    const allCards = useCards().all;
    const functions = useCards().functions;
    const { loadMore } = allCards;

    const onCheck = checkedKeysValues =>
          setSelectedCategories(checkedKeysValues);

    return (
        <>
	  <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onCheck={onCheck}
          />
          <div id="scrollable-card-list-browser"
               style={{
                   height: 400,
                   overflow: 'auto',
                   padding: '0 16px',
                   border: '1px solid rgba(140, 140, 140, 0.35)',
               }}>
            <CardBrowser loadMore={loadMore}
                         cards={allCards.currentPage}
                         functions={functions}/>
          </div>
        </>
    );
}
