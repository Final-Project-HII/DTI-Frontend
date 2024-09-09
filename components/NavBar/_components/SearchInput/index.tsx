import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { FaTimes } from 'react-icons/fa';
import { Search } from 'lucide-react';

interface SearchInputProps {
  defaultSearchTerm?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ defaultSearchTerm = '' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);

  const updateSearchParams = useDebouncedCallback((search: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }

    // Always reset to the first page when searching
    newParams.set('page', '0');

    // Determine the target path
    const targetPath = pathname.startsWith('/product/') ? '/product' : pathname;

    // Construct the full URL
    const fullPath = `${targetPath}?${newParams.toString()}`;

    router.push(fullPath, { scroll: false });
  }, 1000);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateSearchParams(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateSearchParams('');
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative">
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full pl-3 pr-16 py-2 rounded-md text-black"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-300 hover:bg-yellow-400 rounded-lg p-1 px-3 mx-2"
        onClick={isFocused ? handleClearSearch : undefined}
      >
        {isFocused ? (
          <FaTimes className="h-5 w-5 text-blue-600" />
        ) : (
          <Search className="h-5 w-5 text-blue-600" />
        )}
      </Button>
    </div>
  );
};

export default SearchInput;