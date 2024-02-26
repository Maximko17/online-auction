"use client";

import { createNewBid } from "@/actions/bids";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useServerAction } from "@/hooks/user-server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formShema = z.object({
  bid: z
    .number()
    .positive()
    .finite()
    .or(z.string())
    .pipe(z.coerce.number().positive().finite()),
});

export type BidFormFields = z.infer<typeof formShema>;
interface INewBidForm {
  lastBid: number;
  bidIncrement: number;
  lotId: number;
}

export default function BidForm({ lotId, lastBid, bidIncrement }: INewBidForm) {
  const [runAction, isRunning] = useServerAction(createNewBid);
  const { toast } = useToast();
  const form = useForm<BidFormFields>({
    resolver: zodResolver(formShema),
    defaultValues: {
      bid: lastBid + bidIncrement,
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (Number(values?.bid) < lastBid + bidIncrement) {
        form.setError("bid", {
          message: `Ставка не может быть ниже ${lastBid + bidIncrement}₽`,
        });
      } else {
        form.clearErrors("bid");
        void form.trigger("bid");
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit({ bid }: BidFormFields) {
    const res = await runAction({ bid, lotId });
    if (res?.status === 200) {
      return toast({ variant: "success", title: "Ваша ставка принята!" });
    }
    if (res?.status === 401) {
      return toast({
        variant: "destructive",
        title: "Сессия истекла!",
        description: "Перезагрузите страницу",
      });
    }
    if (res?.status === 400) {
      return toast({
        variant: "destructive",
        title: "Проверьте правильность введенной ставки!",
      });
    } else {
      return toast({
        variant: "destructive",
        title: "Ставка не принята!",
        description: "Попробуйте еще раз или повторите позже",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full flex flex-col gap-3 pt-3"
      >
        <FormField
          control={form.control}
          name="bid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ваша ставка</FormLabel>
              <FormControl>
                <CurrencyInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isRunning || !!form.formState.errors.bid}
          type="submit"
          className="mt-1"
        >
          {isRunning ? "Загрузка..." : "Сделать ставку"}
        </Button>
      </form>
    </Form>
  );
}
