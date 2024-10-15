import * as React from 'react'
import { Input } from '../../shadcnComponents/ui/input'
import { FiSearch, FiX } from 'react-icons/fi'
import util from '../../util/common'
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
        onSearch && onSearch(value)
    }
    const isRTL = util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'

    return (
        <div className='flex items-center'>
            <div className='relative'>
                <Input
                    type='text'
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    onKeyDown={handleKeyPress}
                    style={{
                        outline: 'none',
                        boxShadow: 'none',
                    }}
                    className={`w-[240px] border hover:border-brandPrimaryColor h-8 focus:ring-0 ${
                        isRTL
                            ? '!rounded-tl-none !rounded-bl-none !rounded-tr-md !rounded-br-md'
                            : '!rounded-tr-none !rounded-br-none !rounded-tl-md !rounded-bl-md'
                    }`}
                />
                {allowClear && value && (
                    <FiX
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-brandGray1 cursor-pointer bg-brandGray rounded-md'
                        onClick={handleClear}
                    />
                )}
            </div>
            <div
                className={`border border-defaultColor h-8 flex items-center justify-center px-2 ${
                    isRTL
                        ? '!rounded-tr-none !rounded-br-none !rounded-tl-md !rounded-bl-md'
                        : '!rounded-tl-none !rounded-bl-none !rounded-tr-md !rounded-br-md'
                }`}>
                <FiSearch
                    className='text-brandGray1 cursor-pointer'
                    onClick={handleSearchClick}
                    aria-disabled={value === '' ? true : false}
                />
            </div>
        </div>
    )
}

export default SearchInput
