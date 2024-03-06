"use client";
import React from "react";
import { CurrencyInput } from "../ui/currency-input";
import { Label } from "../ui/label";
import { DateTimePicker } from "../ui/date-time-picker/date-time-picker-demo";
import { LotCategory } from "@/types";

interface ISidebarFilters {
  categoryList: LotCategory[];
}

export const SidebarFilters = ({ categoryList }: ISidebarFilters) => {
  return (
    <aside className="w-[320px] p-2 pl-5">
      <h3 className="mb-2 text-lg font-semibold text-gray-800 ">
        Подкатегории
      </h3>
      {categoryList.map((c) => {
        return (
          <ul className="*:border-b *:border-dashed *:py-1">
            <li>{c.name}</li>
          </ul>
        );
      })}
      {/* <Separator /> */}
      <h3 className="pt-2 mb-2 text-lg font-semibold text-gray-800 ">
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
            value={undefined}
            onChange={console.log}
          />
        </li>
        <li>
          <Label>Дата аукциона по</Label>
          <DateTimePicker
            className="mt-2"
            value={undefined}
            onChange={console.log}
          />
        </li>
      </ul>
    </aside>
  );
};
