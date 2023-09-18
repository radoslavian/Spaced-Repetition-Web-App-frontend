import React, { useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from "antd";
import CategorySelector from "./CategorySelector";
import { useCards } from "../contexts/CardsProvider";
import CardBrowser from "./CardBrowser";
import CardsBrowserModal from "./CardsBrowserModal";
import { useCategories } from "../contexts/CategoriesProvider";

export default function CardCategoryBrowser (
    { set_cardBody_visible = f => f }) {
    const { Search } = Input;
    const { categories, selectedCategories,
            setSelectedCategories } = useCategories();
    const allCards = useCards().all;
    const functions = useCards().functions;
    const { loadMore } = allCards;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        set_cardBody_visible(false);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        set_cardBody_visible(true);
    };
    const onCategoryCheck = checkedKeysValues =>
          setSelectedCategories(checkedKeysValues);

    return (
        <>
	  <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onCheck={onCategoryCheck}
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
            <Search placeholder="Search for..." allowClear
                    /* returns event data:
                     * onPressEnter={a => console.log(a)} */
                    onSearch={phrase => allCards.setSearchedPhrase(phrase)}
                    /* loading={true} */
            />
              <CardBrowser loadMore={loadMore}
                           cards={allCards.currentPage}
                           functions={functions}/>

          </CardsBrowserModal>
        </>
    );
}

