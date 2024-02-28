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
import { signUp } from "@/actions/auth";
import { useServerAction } from "@/hooks/user-server-action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formShema = z
  .object({
    email: z.string().email(),
    username: z.string().min(2),
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

export type SignUpFormFields = z.infer<typeof formShema>;

interface ISignUpForm {
  email: string;
  token: string;
}

export default function SignUpForm({ email, token }: ISignUpForm) {
  const [runAction, isRunning] = useServerAction(signUp);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignUpFormFields>({
    resolver: zodResolver(formShema),
    defaultValues: {
      email,
      username: "",
      password: "",
      passwordConfirmation: "",
      token,
    },
  });
  async function onSubmit(data: SignUpFormFields) {
    const res = await runAction(data);
    console.log(res);
    if (res?.status === 201) {
      toast({ variant: "success", title: "Вы успешно зарегистрировались!" });
      router.push("/");
    } else if (res?.status === 400) {
      toast({
        variant: "destructive",
        title: "Проверьте правильность введенных данных!",
        description: "Некоторые из полей заполнены неверно",
      });
    } else if (res?.status === 409) {
      toast({
        variant: "destructive",
        title: "Пользователь уже был создан недавно!",
        description:
          "Войдите в систему либо зарегистрируйтесь под новым эл. адресом",
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
            Регистрация пользователя
          </h5>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес электронной почты</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ваше имя</FormLabel>
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
            {isRunning ? "Загрузка..." : "Зарегистрироваться"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
