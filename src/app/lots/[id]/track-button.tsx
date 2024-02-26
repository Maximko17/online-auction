"use client";
import { trackLot } from "@/actions/lots";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useServerAction } from "@/hooks/user-server-action";
import { Check, Loader2, Plus } from "lucide-react";

interface ITrackLotButton {
  lotId: number;
  isTracking: boolean;
}

export default function TrackLotButton({ lotId, isTracking }: ITrackLotButton) {
  const { toast } = useToast();
  const [runAction, isRunning] = useServerAction(trackLot);

  const startLotTracking = async () => {
    const res = await runAction(lotId);
    if (res?.status === 200) {
      toast({ variant: "success", title: "Лот добавлен в отслеживаемые!" });
    }
    if (res?.status === 401) {
      return toast({
        variant: "destructive",
        title: "Сессия истекла!",
        description: "Перезагрузите страницу",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Произошла ошибка!",
        description: "Попробуйте еще раз или повторите позже",
      });
    }
  };

  const getButtonText = () => {
    if (isRunning) {
      return (
        <>
          <Loader2 className="mr-1 w-5 h-5 animate-spin" />
          <span>Загрузка...</span>
        </>
      );
    } else if (isTracking) {
      return (
        <>
          <Check className="mr-1 w-5 h-5" />
          <span>Лот отслеживается</span>
        </>
      );
    }
    if (isTracking) {
      return <span>Отслеживать лот</span>;
    }
  };

  return (
    <Button
      onClick={startLotTracking}
      disabled={isRunning}
      type="submit"
      variant={isTracking ? "success" : "default"}
      className={"w-full mt-[15px]"}
    >
      {getButtonText()}
    </Button>
  );
}
