"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { resetPassword } from "@/actions/auth";
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
import { useToast } from "@/hooks/use-toast";
import { useServerAction } from "@/hooks/user-server-action";
import { useRouter } from "next/navigation";

interface IResetPasswordForm {
  token: string;
}

const formSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirmation: z.string(),
    token: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      message: "Пароли не совпадают",
      path: ["passwordConfirmation"],
    },
  );

export type ResetPasswordFormFields = z.infer<typeof formSchema>;

export default function ResetPasswordForm({ token }: IResetPasswordForm) {
  const [runAction, isRunning] = useServerAction(resetPassword);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ResetPasswordFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
      token,
    },
  });

  async function onSubmit(data: ResetPasswordFormFields) {
    const result = await runAction(data);
    if (result?.status === 204) {
      toast({ variant: "success", title: "Пароль успешно изменен!" });
      return router.push("/sign-in");
    } else if (result?.status === 400) {
      toast({
        variant: "destructive",
        title: "Не все поля введены корректно!",
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
    <div className="w-full mx-auto my-5 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <h5 className="text-xl font-medium text-gray-900 text-center">
            Смена пароля
          </h5>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтверждение пароля</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isRunning} type="submit" className="mt-3">
            {isRunning ? "Загрузка..." : "Сменить пароль"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
