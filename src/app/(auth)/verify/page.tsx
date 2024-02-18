"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { verifyEmail } from "@/actions/auth";

export const formShema = z.object({
  email: z.string().email(),
});

export type VerifyEmailFields = z.infer<typeof formShema>;

export default function VerifyEmail() {
  const { pending } = useFormStatus();
  const form = useForm<z.infer<typeof formShema>>({
    resolver: zodResolver(formShema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof formShema>) {
    verifyEmail(data);
  }

  return (
    <div className="flex flex-col items-center p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md w-full gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес электронной почты</FormLabel>
                <FormControl>
                  <Input placeholder="Ваш@адрес.почты" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3">
            {pending ? "Loading" : "Регистрация"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
