"use client";

import { editLot } from "@/actions/lots";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker-demo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useServerAction } from "@/hooks/user-server-action";
import { Lot, LotCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CategorySelect from "../../app/lots/new/category-selector";
import Link from "next/link";

interface ICreateLotForm {
  categoriesTree: LotCategory[];
  initLotData: Lot;
}

const formShema = z.object({
  name: z.string().min(2),
  description: z.string().min(10).max(4000),
  startTime: z.date(),
  endTime: z.date(),
  startBid: z
    .number()
    .positive()
    .finite()
    .or(z.string())
    .pipe(z.coerce.number().positive().finite()),
  bidIncrement: z
    .number()
    .positive()
    .finite()
    .or(z.string())
    .pipe(z.coerce.number().positive().finite()),
  images: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size < 10 * 1024 * 1024),
      "File size must be less than 10MB",
    ),
});

export type NewLotFormFields = z.infer<typeof formShema>;

export default function EditLotForm({
  categoriesTree,
  initLotData,
}: ICreateLotForm) {
  const [runAction, isRunning] = useServerAction(editLot);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<NewLotFormFields>({
    resolver: zodResolver(formShema),
    defaultValues: {
      name: initLotData.name,
      description: initLotData.description,
      startTime: new Date(initLotData.startTime),
      endTime: new Date(initLotData.endTime),
      startBid: initLotData.startBid,
      bidIncrement: initLotData.bidIncrement,
      images: [],
    },
  });

  async function onSubmit({ images, ...data }: NewLotFormFields) {
    const formData = new FormData();
    for (const image of images) {
      formData.append("image", image);
    }
    formData.append(
      "lot",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      }),
    );

    const result = await runAction({ id: initLotData.id, data: formData });
    if (result?.status === 204) {
      toast({
        variant: "success",
        title: "Лот успешно обновлен!",
      });
      return router.push(`/lots/${initLotData.id}`);
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
            Редактирование лота
          </h5>
          <CategorySelect categoriesTree={categoriesTree} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Наименование</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startBid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Начальная цена</FormLabel>
                <FormControl>
                  <CurrencyInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bidIncrement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Инкремент</FormLabel>
                <FormControl>
                  <CurrencyInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Время начала аукциона</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Время окончания аукциона</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea className="resize-none h-32" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фото</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files || []);
                      field.onChange(filesArray);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex mt-3 items-center ">
            <Button disabled={isRunning} type="submit" className="flex-1 mr-2">
              {isRunning ? "Идет обновление..." : "Обновить"}
            </Button>
            <Link
              href={`/lots/${initLotData.id}`}
              className="flex-1 py-2 px-4 bg-primary text-primary-foreground shadow hover:bg-primary/90 text-center font-medium rounded-md text-sm transition-colors"
            >
              Отмена
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
