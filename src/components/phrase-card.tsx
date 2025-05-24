"use client";

import type { Phrase } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePhrases } from "@/contexts/phrase-context";
import { Trash2, CalendarDays } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type PhraseCardProps = {
  phrase: Phrase;
};

const PhraseCard = (props: PhraseCardProps) => {
  const { phrase } = props;

  const { deletePhrase } = usePhrases();

  return (
    <Card className="flex flex-col justify-between h-full shadow-lg rounded-lg border border-border animate-fade-in-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-normal leading-relaxed text-foreground">
          "{phrase.text}"
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex justify-between items-center pt-2 pb-4 px-4 border-t border-border/50">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          {format(new Date(phrase.createdAt), "d MMM, yyyy", { locale: es })}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" aria-label="Eliminar frase">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la frase.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePhrase(phrase.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default PhraseCard;
