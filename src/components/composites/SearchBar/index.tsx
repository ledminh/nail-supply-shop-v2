import { FC, useEffect } from 'react';
import styles from '@styles/composites/SearchBar.module.scss';

import { useState } from 'react';

import ImageCPN from '@/components/basics/ImageCPN';
import { searchIcon } from '@/config';


interface Props {
    onSearchSubmit: (query: string) => void;
    placeholder?: string;
}

export type SearchBar = FC<Props>;


const SearchBarCPN:SearchBar = ({onSearchSubmit, placeholder}) => {

    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if(query.length > 0){
            onSearchSubmit(query);
            setQuery('');
        }
    };
    
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        
        if(e.key === 'Enter') {
            if(query.length > 0){
                onSearchSubmit(query);
                setQuery('');
            }
        }
    };



    

    return (
        <div className={styles.wrapper}>
            <input type="text" 
                className={styles.input}
                placeholder={placeholder?? 'Search'} 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                />
            <button 
                className={styles.button}
                type="submit"
                onClick={handleSearch}
            >
                <ImageCPN 
                    image={searchIcon} 
                    size="small"
                    className={styles.searchIcon}
                    />
            </button>
        </div>
    );
}

export default SearchBarCPN;