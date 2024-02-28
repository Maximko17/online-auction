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
import { signIn } from "@/actions/auth";
import { useServerAction } from "@/hooks/user-server-action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInFormFields = z.infer<typeof formSchema>;

export default function SignInForm() {
  const [runAction, isRunning] = useServerAction(signIn);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormFields) {
    const result = await runAction(data);
    if (result?.status === 200) {
      return router.push("/");
    } else if (result?.status === 400) {
      toast({ variant: "destructive", title: "Не все поля введены корретно!" });
    } else if (result?.status === 401) {
      toast({ variant: "destructive", title: "Неверный логин или пароль" });
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
            Вход на платформу
          </h5>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес электронной почты</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3" disabled={isRunning}>
            {isRunning ? "Загрузка..." : "Войти"}
          </Button>
          <div className="text-sm font-medium text-gray-500 text-center">
            Не зарегистрированы?{" "}
            <Link
              href="/verify"
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              Создать аккаунт
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
