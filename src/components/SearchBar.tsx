import type { ChangeEvent } from 'react';
import { Input } from '../ui';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search tasks...',
}: SearchBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full">
      <span
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-surface-400"
        aria-hidden
      >
        <i className="fa-solid fa-magnifying-glass text-sm" />
      </span>
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10"
        aria-label="Search tasks by name"
        autoComplete="off"
      />
    </div>
  );
};
