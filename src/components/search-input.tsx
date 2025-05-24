"use client";

import { Input } from "@/components/ui/input";
import { usePhrases } from "@/contexts/phrase-context";
import { Search } from "lucide-react";

const SearchInput = () => {
  const { searchTerm, setSearchTerm } = usePhrases();

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar frases..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full rounded-md shadow-sm focus:ring-accent focus:border-accent"
        aria-label="Buscar frases"
      />
    </div>
  );
}

export default SearchInput;
