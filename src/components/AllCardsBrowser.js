import { useRef, useState, useEffect } from "react";
import CardBrowser from "./CardBrowser";
import { Input, Skeleton } from "antd";
import { useCards } from "../contexts/CardsProvider";

function LoadingFallback() {
    return (
        <span data-testid="card-category-browser-fallback-component">
          <Skeleton style={{minHeight: "45vw"}}/>
        </span>
    );
}

export default function AllCardsBrowser(
    { set_cardBody_visible = f => f, cards, title }) {
    const { Search } = Input;
    const scrollRef = useRef(null);
    const functions = useCards().functions;
    const { loadMore } = cards;
    const showSuspenseChildren = useRef(false);
    const [searchedPhrase, setSearchedPhrase] = useState(
        cards.searchedPhrase);

    useEffect(() => setSearchedPhrase(cards.searchedPhrase),
              [cards.searchedPhrase]);
    
    const scrollToTop = () => {
        // solution from:
        // How to Scroll to the Bottom of a Div Element in React
        // https://codingbeautydev.com/blog/react-scroll-to-bottom-of-div/
        scrollRef?.current?.scrollIntoView();
    };
    const handleSearch = phrase => {
        cards.setSearchedPhrase(phrase);
        scrollToTop();
    };
    const loadMoreCards = async () => {
        showSuspenseChildren.current = true;
        await loadMore();
        showSuspenseChildren.current = false;
    };

    return (
        <>
          <div style={{
              marginTop: "10px",
              marginBottom: "5px"
          }}>
            { Boolean(title) && title }
          </div>
          <Search placeholder="Search for..."
                  allowClear
                  onSearch={handleSearch}
                  value={searchedPhrase}
                  onChange={e => setSearchedPhrase(e.target.value)}
          />
          {
              (!cards.isLoading
               || showSuspenseChildren.current) ?
                  <CardBrowser scrollRef={scrollRef}
                               loadMore={loadMoreCards}
                               cards={cards}
                               functions={functions}/>
              : <LoadingFallback/>
          }
        </>
    );
}
