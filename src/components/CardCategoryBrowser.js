import React, { useState, useRef } from "react";
import { Button, Input, Skeleton, Tag } from "antd";
import CategorySelector from "./CategorySelector";
import { useCards } from "../contexts/CardsProvider";
import { useCategories } from "../contexts/CategoriesProvider";
import CardBrowser from "./CardBrowser";
import CardsBrowserModal from "./CardsBrowserModal";

function LoadingFallback() {
    return (<span data-testid="card-category-browser-fallback-component">
              <Skeleton style={{minHeight: "45vw"}}/>
            </span>);
}

export default function CardCategoryBrowser (
    { set_cardBody_visible = f => f }) {
    const scrollRef = useRef(null);
    const { Search } = Input;
    const { categories, selectedCategories,
            setSelectedCategories } = useCategories();
    const allCards = useCards().all;
    const functions = useCards().functions;
    const { loadMore } = allCards;
    const [searchedPhrase, setSearchedPhrase] = useState("");
    const showSuspenseChildren = useRef(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        set_cardBody_visible(false);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        set_cardBody_visible(true);
    };
    const onCloseModal = () => {
        allCards.setSearchedPhrase("");
        if (searchedPhrase !== "") setSearchedPhrase("");
        closeModal();
    };
    const scrollToTop = () => {
        // solution from:
        // How to Scroll to the Bottom of a Div Element in React
        // https://codingbeautydev.com/blog/react-scroll-to-bottom-of-div/
        scrollRef?.current?.scrollIntoView();
    };
    const handleSearch = phrase => {
        allCards.setSearchedPhrase(phrase);
        scrollToTop();
    };
    const onCategoryCheck = checkedKeysValues =>
          setSelectedCategories(checkedKeysValues);
    const loadMoreCards = async () => {
        showSuspenseChildren.current = true;
        await loadMore();
        showSuspenseChildren.current = false;
    };
    const cardsBrowserTitle = (
        <span>
          <Tag color="cyan">{`${allCards.count}`} card(s)</Tag>
          in the current set (all cards)
        </span>
    );

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
          <CardsBrowserModal title={cardsBrowserTitle}
                             isOpen={isModalOpen}
                             closeModal={onCloseModal}>
            <Search placeholder="Search for..." allowClear
                    onSearch={handleSearch}
                    value={searchedPhrase}
                    onChange={e => setSearchedPhrase(e.target.value)}
            />
            {
                (!allCards.isLoading
                 || showSuspenseChildren.current) ?
                    <CardBrowser scrollRef={scrollRef}
                                 loadMore={loadMoreCards}
                                 cards={allCards}
                                 functions={functions}/>
                : <LoadingFallback/>
            }
          </CardsBrowserModal>
        </>
    );
}

