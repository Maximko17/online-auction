"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyEmail } from "@/actions/auth";
import { useServerAction } from "@/hooks/user-server-action";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const formShema = z.object({
  email: z.string().email(),
});

export type VerifyEmailFields = z.infer<typeof formShema>;

export default function VerifyEmail() {
  const [runAction, isRunning] = useServerAction(verifyEmail);
  const [emailSend, setEmailSend] = useState(false);
  const { toast } = useToast();
  const form = useForm<VerifyEmailFields>({
    resolver: zodResolver(formShema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: VerifyEmailFields) {
    const res = await runAction(data);
    if (res?.status === 204) {
      toast({
        variant: "success",
        title: "Сообщение отправлено на указаный адрес!",
      });
      setEmailSend(true);
    } else if (res?.status === 400) {
      toast({
        variant: "destructive",
        title: "Адрес электронной почты не введен!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Произошла ошибка!",
        description: "Попробуйте еще раз или повторите позже",
      });
    }
  }

  return (
    <div className="w-full mx-auto my-5 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <h5 className="text-xl font-medium text-gray-900 text-center">
            Начало регистрации
          </h5>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес электронной почты</FormLabel>
                <FormControl>
                  <Input placeholder="Ваш@адрес.почты" {...field} />
                </FormControl>
                <FormDescription>
                  {emailSend
                    ? "Письмо отправлено! Проверьте свой адрес электронной почты."
                    : "Введите ваш адрес электронной почты для дальнейшей регистрации. "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-3"
            disabled={emailSend || isRunning || !!form.formState.errors.email}
          >
            {isRunning ? "Отправка письма..." : "Зарегистрироваться"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
