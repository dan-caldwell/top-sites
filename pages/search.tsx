import { useState } from 'react';

const searchUrl = `https://top-sites-list.s3.amazonaws.com/`;

type Rank = {
  url: string,
  rank: number
}

const Search = () => {
    const [searchString, setSearchString] = useState('');
    const [singleLetterSearchPage, setSingleLetterSearchPage] = useState({
        letters: '',
        results: []
    });
    const [twoLetterSearchPage, setTwoLetterSearchPage] = useState({
        letters: '',
        results: []
    });
    const [searchResults, setSearchResults] = useState<Rank[]>([]);

    const handleSearchChange = async (e: React.SyntheticEvent) => {

        // Ensure acceptable key pressed
        const nativeEvent = e.nativeEvent as InputEvent;
        const keyPressed = nativeEvent.data || '';
        const acceptableChars = "abcdefghijklmnopqrstuvwxyz0123456789.-";
        if (!acceptableChars.includes(keyPressed)) return;
        const target = e.target as HTMLInputElement;
        setSearchString(target.value);
    }
    
    const handleListRankings = async () => {
        const res = await fetch(`${searchUrl}pages/1.json`);
        const parsed = await res.json();
        setSearchResults(parsed);
    }

    const handleSearchClick = async (e: React.MouseEvent) => {

        if (!searchString) {
            await handleListRankings();
            return;
        }

        let parsedResults: Rank[] = [];
        if (searchString.length == 1 && singleLetterSearchPage.letters !== searchString[0]) {
            const res = await fetch(`${searchUrl}characters/${searchString}.json`);
            const parsed = await res.json();
            setSingleLetterSearchPage({
                letters: searchString,
                results: parsed
            });
            parsedResults = parsed;
        } else if (searchString.length > 1 && twoLetterSearchPage.letters !== searchString.slice(0, 2)) {
            const res = await fetch(`${searchUrl}characters/${searchString.slice(0, 2)}.json`);
            const parsed = await res.json();
            setTwoLetterSearchPage({
                letters: searchString.slice(0, 2),
                results: parsed
            });
            parsedResults = parsed;
        }
        if (singleLetterSearchPage.results.length && singleLetterSearchPage.letters === searchString[0]) parsedResults = singleLetterSearchPage.results;
        if (twoLetterSearchPage.results.length && twoLetterSearchPage.letters === searchString.slice(0, 2)) parsedResults = twoLetterSearchPage.results;
        console.log(parsedResults[0], searchString);
        setSearchResults(oldResults => {
            return parsedResults.filter((item: Rank) => item.url.includes(searchString))
        });
    }

    const handleClearSearch = () => {
        setSearchString('');
        handleListRankings();
    }

    return (
        <div>
            <input className="border border-black" type="text" value={searchString} onChange={handleSearchChange} />
            <button className="border border-black" onClick={handleSearchClick}>Search</button>
            <button className="border border-black" onClick={handleClearSearch}>Clear</button>
            <div>
                {searchResults.map(result => (
                    <div key={result.url}>{result.rank} - {result.url}</div>
                ))}
            </div>
        </div>
    )
}

export default Search;