"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sendResetPasswordEmail } from "@/actions/auth";
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
import { useToast } from "@/hooks/use-toast";
import { useServerAction } from "@/hooks/user-server-action";
import { useState } from "react";

export const formShema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFields = z.infer<typeof formShema>;

export default function ForgotPassword() {
  const [runAction, isRunning] = useServerAction(sendResetPasswordEmail);
  const [emailSend, setEmailSend] = useState(false);
  const { toast } = useToast();
  const form = useForm<ForgotPasswordFields>({
    resolver: zodResolver(formShema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFields) {
    const res = await runAction(data);
    if (res?.status === 204) {
      toast({
        variant: "success",
        title: "Сообщение отправлено!",
        description:
          "Сообщение о сбросе пароля успешно отправлено на указанный адрес!",
      });
      setEmailSend(true);
    } else if (res?.status === 404) {
      toast({
        variant: "destructive",
        title: "Пользователь с таким адресом не найден!",
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
            Забыли пароль?
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
                    : "Введите ваш адрес электронной почты для дальнейшего сброса пароля. "}
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
            {isRunning ? "Отправка письма..." : "Отправить письмо"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
