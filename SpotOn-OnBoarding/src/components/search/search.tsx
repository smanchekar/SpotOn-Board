import React from 'react';
import './search.scss';
import { Input, InputProps, Icon, colors } from '../index';

interface SearchProps extends InputProps {}

const Search = (props: SearchProps) => {
    return (
        <div className="search">
            <Icon
                name="SearchIcon"
                className="search-icon"
                alt="search icon"
                size={45}
                color={colors.gray70}
            />
            <Input type="text" className="search-input" {...props} />
        </div>
    );
};

export default Search;
