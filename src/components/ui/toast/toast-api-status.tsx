"use client";

import { ToastAction } from "@/components/ui/toast/toast";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ToastApiErrorMessage({ status }: { status: number }) {
  const { toast } = useToast();
  useEffect(() => {
    if (status === 401) {
      toast({
        title: "Ваша сессия истекла",
        description: "Перезагрузите страницу",
        action: (
          <ToastAction altText="Reload" onClick={() => redirect("/")}>
            Перезагрузить
          </ToastAction>
        ),
      });
    } else if (status === 500) {
      toast({
        variant: "destructive",
        title: "Произошла ошибка на сервере",
        description: "Повторите попытку или попробуйте позже",
      });
    }
  }, []);
  return <></>;
}
