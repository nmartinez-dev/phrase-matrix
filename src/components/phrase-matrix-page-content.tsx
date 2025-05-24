"use client";

import { usePhrases } from "@/contexts/phrase-context";
import AddPhraseForm from "./add-phrase-form";
import PhraseCard from "./phrase-card";
import SearchInput from "./search-input";
import { ScrollArea } from "@/components/ui/scroll-area";

const PhraseMatrixPageContent = () => {
  const { phrases, filteredPhrases } = usePhrases();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary-foreground bg-primary py-3 px-6 rounded-lg shadow-md inline-block">
          Matriz de frases
        </h1>
      </header>

      <div className="flex flex-col gap-4 mb-4">
        <AddPhraseForm />
        {phrases.length > 0 && <SearchInput />}
      </div>

      <ScrollArea className="flex-grow">
        {phrases.length > 0 && (
          filteredPhrases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
              {filteredPhrases.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 h-full">
              <p className="text-xl text-muted-foreground mb-2">No se encontraron frases.</p>
              <p className="text-md text-muted-foreground">Intenta añadir una nueva frase o ajusta tu búsqueda.</p>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}

export default PhraseMatrixPageContent;
