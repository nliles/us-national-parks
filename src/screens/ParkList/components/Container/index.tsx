import { useState, useEffect, useRef, FormEvent } from "react";
import List from "screens/ParkList/components/List";
import usePark from "screens/hooks/usePark";
import useParks from "screens/hooks/useParks";
import { stripPunctuation } from "screens/helpers/stripPunctuation";

const Container = () => {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const listRef = useRef<HTMLDivElement>(null);
  const { isFetching, setIsFetching, parks, error, total } =
    useParks(pageNumber);
  const { parks: filteredParks, error: searchError } = usePark({
    query,
    searchByCode: false,
  });

  useEffect(() => {
    if (isFetching && parks.length < total) {
      setPageNumber((prevNumber) => prevNumber + 1);
    }
  }, [isFetching, parks, total]);

  const handleScroll = () => {
    if (listRef?.current) {
      const scrolled =
        listRef.current.scrollHeight -
          listRef.current.scrollTop -
          listRef.current.clientHeight <
        1;
      if (scrolled) {
        setIsFetching(true);
      }
    }
  };

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const query = (e.target as HTMLInputElement).value;
    setQuery(query);
  };

  const filteredData = filteredParks?.filter((element) => {
    return stripPunctuation(element.fullName).includes(stripPunctuation(query));
  });

  const displayData = query ? filteredData : parks;

  return (
    <List
      error={error}
      searchError={searchError}
      ref={listRef}
      parks={displayData}
      handleScroll={handleScroll}
      handleInputChange={handleInputChange}
      query={query}
    />
  );
};

export default Container;
