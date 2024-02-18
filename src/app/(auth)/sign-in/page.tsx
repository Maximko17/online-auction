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
import { redirect, useRouter } from "next/navigation";

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
    var result = await runAction(data);
    if (result?.status === 200) {
      return router.push("/");
    }
    if (result?.status === 400) {
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
    <div className="flex flex-col items-center p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md w-full flex flex-col gap-3"
        >
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
        </form>
      </Form>
    </div>
  );
}
