import React, { useState } from "react";
import { Button } from "antd";
import CategorySelector from "./CategorySelector";
import { useCards } from "../contexts/CardsProvider";
import CardBrowser from "./CardBrowser";
import CardsBrowserModal from "./CardsBrowserModal";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardCategoryBrowser() {
    const { categories, selectedCategories,
            setSelectedCategories } = useCategories();
    const allCards = useCards().all;
    const functions = useCards().functions;
    const { loadMore } = allCards;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const onCheck = checkedKeysValues =>
          setSelectedCategories(checkedKeysValues);

    return (
        <>
	  <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onCheck={onCheck}
          />
          <Button type="primary"
                  onClick={showModal}>
            Browse all cards
          </Button>
          <CardsBrowserModal title="All cards"
                             isOpen={isModalOpen}
                             onClose={e => {
                                 e.stopPropagation();
                                 closeModal();
                             }}
                             closeModal={closeModal}>
            <div id="scrollable-card-list-browser"
                 style={{
                     // found in StackOverflow question:
                     // "How to limit the height of the modal?"
                     maxHeight: "calc(100vh - 225px)",
                     overflow: "auto",
                     padding: '0 16px',
                 }}
            >
              <CardBrowser loadMore={loadMore}
                           cards={allCards.currentPage}
                           functions={functions}/>
            </div>
          </CardsBrowserModal>
        </>
    );
}

