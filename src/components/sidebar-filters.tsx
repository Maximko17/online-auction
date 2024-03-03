"use client";
import React from "react";
import { Separator } from "./ui/separator";
import { CurrencyInput } from "./ui/currency-input";
import { Label } from "./ui/label";
import { DateTimePicker } from "./ui/date-time-picker/date-time-picker-demo";

export const SidebarFilters = () => {
  return (
    <aside className="w-[320px] border-r p-2 pl-5">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Подкатегории
      </h3>
      <Separator />
      <h3 className="pt-2 mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Параметры
      </h3>
      <ul className="flex flex-col gap-5 pl-[5px]">
        <li>
          <Label>Цена (₽)</Label>
          <fieldset className="flex gap-3 mt-2">
            <CurrencyInput
              usePrefix={false}
              onChange={console.log}
              placeholder="от"
            />
            <CurrencyInput
              usePrefix={false}
              onChange={console.log}
              placeholder="до"
            />
          </fieldset>
        </li>
        <li>
          <Label>Дата аукциона c</Label>
          <DateTimePicker
            className="mt-2"
            value={new Date()}
            onChange={console.log}
          />
        </li>
        <li>
          <Label>Дата аукциона по</Label>
          <DateTimePicker
            className="mt-2"
            value={new Date()}
            onChange={console.log}
          />
        </li>
      </ul>
    </aside>
  );
};
