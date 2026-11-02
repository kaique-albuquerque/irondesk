import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onValueChange, className, placeholder = 'Buscar...', ...rest },
  ref,
) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className="control pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        {...rest}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onValueChange('')}
          aria-label="Limpar busca"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-subtle transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
});
