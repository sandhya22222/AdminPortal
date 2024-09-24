import * as React from 'react'
import { Input } from '../../shadcnComponents/ui/input' // Import ShadCN Input component
import { FiSearch, FiX } from 'react-icons/fi' // Import icons for search and clear

const SearchInput = ({ placeholder, onSearch, onChange, value, suffix, maxLength, enterButton, allowClear }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch && onSearch(value)
        }
    }

    const handleClear = () => {
        onChange({ target: { value: '' } })
    }

    const handleSearchClick = () => {
        onSearch && onSearch(value) // Trigger search on icon click
    }

    return (
        <div className={`!relative`}>
            <Input
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                onKeyDown={handleKeyPress} // Trigger onSearch on Enter key press
                style={{
                    outline: 'none',
                    boxShadow: 'none',
                }} // Inline styles to remove focus ring
                className={` w-[240px] border hover:border-brandPrimaryColor h-8 focus:ring-0 `} // Adjust padding for icons
            />
            {allowClear && value && (
                <FiX
                    className='absolute right-9 top-1/2 transform -translate-y-1/2 text-brandGray1 cursor-pointer bg-brandGray rounded-md'
                    onClick={handleClear}
                />
            )}

            <div className='absolute right-8 top-1/2 transform -translate-y-1/2 h-[33px] w-px bg-gray-300'></div>
            <FiSearch
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-brandGray1 cursor-pointer'
                onClick={handleSearchClick}
                aria-disabled={value === '' ? true : false}
            />
            {suffix && <span className='absolute right-3 top-1/2 transform -translate-y-1/2'>{suffix}</span>}
        </div>
    )
}

export default SearchInput
