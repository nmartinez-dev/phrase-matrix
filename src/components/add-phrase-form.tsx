"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { usePhrases } from "@/contexts/phrase-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
  phraseText: z.string().min(1, "La frase no puede estar vacía.").max(280, "La frase es demasiado larga."),
});

type FormData = z.infer<typeof formSchema>;

const AddPhraseForm = () => {
  const { addPhrase } = usePhrases();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phraseText: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    addPhrase(data.phraseText);
    form.reset();
  };

  return (
    <Card className="w-full shadow-lg rounded-lg border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Añadir nueva frase
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phraseText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Texto de la frase</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe tu frase inspiradora aquí..."
                      className="min-h-[80px] resize-none focus:ring-accent focus:border-accent rounded-md"
                      aria-label="Texto de la nueva frase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md">
              Añadir frase
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddPhraseForm;
