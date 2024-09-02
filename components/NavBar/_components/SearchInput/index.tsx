import React, { useState } from 'react'
import { Input } from '../../../ui/input'
import { Button } from '../../../ui/button'
import { FaTimes } from 'react-icons/fa'
import { Search } from 'lucide-react'

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search products..."
        className="w-full pl-3 pr-16 py-2 rounded-md text-black"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-300 hover:bg-yellow-400 rounded-lg p-1 px-3 mx-2"
      >
        {isFocused ? <FaTimes className="h-5 w-5 text-blue-600" /> : <Search className="h-5 w-5 text-blue-600" />}
      </Button>
    </div>
  )
}

export default SearchInput