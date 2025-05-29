"use client";

import type { Phrase } from '@/types';
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PhraseContextType {
  phrases: Phrase[];
  searchTerm: string;
  addPhrase: (text: string) => void;
  deletePhrase: (id: string) => void;
  setSearchTerm: (term: string) => void;
  filteredPhrases: Phrase[];
}

const PhraseContext = createContext<PhraseContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'phraseMatrixApp_phrases_es';

type PhraseProviderProps = {
  children: ReactNode;
}

export const PhraseProvider = (props: PhraseProviderProps) => {
  const { children } = props;

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPhrases = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPhrases) {
        const parsedPhrases = JSON.parse(storedPhrases) as Array<Omit<Phrase, 'createdAt'> & { createdAt: string }>;
        setPhrases(parsedPhrases.map(p => ({ ...p, createdAt: new Date(p.createdAt) })));
      }
    } catch (error) {
      console.error("Error al cargar frases de localStorage", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las frases del almacenamiento.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(phrases));
    } catch (error) {
      console.error("Error al guardar frases en localStorage", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las frases en el almacenamiento.",
        variant: "destructive",
      });
    }
  }, [phrases, toast]);

  const addPhrase = useCallback((text: string) => {
    if (!text.trim()) {
      toast({
        title: "Error de Validación",
        description: "El texto de la frase no puede estar vacío.",
        variant: "destructive",
      });
      return;
    }

    if (text.trim().length > 280) {
      toast({
        title: "Error de Validación",
        description: "La frase no puede tener más de 280 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const normalizedText = text.trim().toLowerCase();
    const isDuplicate = phrases.some(phrase => 
      phrase.text.toLowerCase() === normalizedText
    );

    if (isDuplicate) {
      toast({
        title: "Error de Validación",
        description: "Esta frase ya existe en la matriz.",
        variant: "destructive",
      });
      return;
    }

    const newPhrase: Phrase = {
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date(),
    };
    setPhrases(prevPhrases => [newPhrase, ...prevPhrases]);
    toast({
      title: "Éxito",
      description: "¡Frase añadida con éxito!",
    });
  }, [toast, phrases]);

  const deletePhrase = useCallback((id: string) => {
    setPhrases(prevPhrases => prevPhrases.filter(phrase => phrase.id !== id));
    toast({
      title: "Éxito",
      description: "¡Frase eliminada con éxito!",
      variant: "default",
    });
  }, [toast]);

  const filteredPhrases = useMemo(() => {
    return phrases.filter(phrase =>
      phrase.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [phrases, searchTerm]);

  return (
    <PhraseContext.Provider value={{ phrases, searchTerm, addPhrase, deletePhrase, setSearchTerm, filteredPhrases }}>
      {children}
    </PhraseContext.Provider>
  );
};

export const usePhrases = () => {
  const context = useContext(PhraseContext);
  if (context === undefined) {
    throw new Error('usePhrases debe ser utilizado dentro de un PhraseProvider');
  }
  return context;
};
