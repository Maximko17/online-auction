"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { CurrencyInput } from "@/components/ui/currency-input";
import { createNewLot } from "@/actions/lots";
import { useServerAction } from "@/hooks/user-server-action";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import CategorySelect from "./category-selector";
import { LotCategory } from "@/types";

interface ICreateLotForm {
  categoriesTree: LotCategory[] | null;
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
    .array(
      z.instanceof(File),
      // .refine(
      //   (file) => file.size < 1 * 1024 * 1024,
      //   "File size must be less than 1MB",
      // ),
    )
    .min(1, "At least 1 file is required"),
  // .refine(
  //   (files) => files.every((file) => file.size < 1 * 1024 * 1024),
  //   "File size must be less than 1MB",
  // ),
});

export type NewLotFormFields = z.infer<typeof formShema>;

export default function CreateLotForm({ categoriesTree }: ICreateLotForm) {
  const [runAction, isRunning] = useServerAction(createNewLot);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<NewLotFormFields>({
    resolver: zodResolver(formShema),
    defaultValues: {
      name: "",
      description: "",
      //   startTime: new Date(),
      //   endTime: new Date(),
      startBid: 100.0,
      bidIncrement: 10.0,
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

    const result = await runAction(formData);
    if (result?.status === 201) {
      toast({
        variant: "success",
        title: "Новый лот создан успешно",
      });
      return router.push(`/lots/${result.data!.id}`);
    }
    if (result?.status === 400) {
      toast({
        variant: "destructive",
        title: "Проверьте правильность введенных данных!",
        description: "Некоторые из полей заполнены неверно",
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
            Создание лота
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
          <Button disabled={isRunning} type="submit" className="mt-3">
            {isRunning ? "Идет создание..." : "Создать"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
