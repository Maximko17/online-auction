"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarProps,
} from "@/components/ui/date-time-picker/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker-demo";

type DateTimePickerProps = CalendarProps & {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

export const DateTimePicker = React.forwardRef<
  HTMLInputElement,
  DateTimePickerProps
>(({ ...props }, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !props.value && "text-muted-foreground",
            props.className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value ? (
            format(props.value, "PPP HH:mm:ss")
          ) : (
            <span>Выберите дату</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode={"single"}
          selected={props.value}
          onSelect={props.onChange}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePickerDemo setDate={props.onChange} date={props.value} />
        </div>
      </PopoverContent>
    </Popover>
  );
});
