import styles from '@styles/SearchBar.module.scss';

import { useState } from 'react';



export default function SearchBar() {

    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(query);
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
