import { FC } from 'react';
import styles from '@styles/SearchBar.module.scss';

import { useState } from 'react';


interface Props {
    onSearchSubmit: (query: string) => void;
}

export type SearchBar = FC<Props>;


const SearchBarCPN:SearchBar = ({onSearchSubmit}) => {

    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        onSearchSubmit(query);
    };


    return (
        <div className={styles.wrapper}>
            <input type="text" 
                placeholder="Search" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
            <button type="submit"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
}

export default SearchBarCPN;