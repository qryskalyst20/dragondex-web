"use client";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useEffect, useState, useMemo, useTransition } from "react";
import { SetDragons } from "@/backend/SetDragons";
import { GetDragons } from "@/backend/GetDragons";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import lodash, { debounce } from "lodash";

export default function Home() {
  const [dragonData, setDragonData] = useState([
    { dragon_name: "", dragon_image: "" },
  ]);
  const [filteredData, setFilteredData] = useState(dragonData);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Get the last execution timestamp from local storage
    const lastExecutionTimestamp = localStorage.getItem(
      "lastExecutionTimestamp"
    );

    // Calculate the current timestamp
    const currentTimestamp: number = new Date().getTime();

    // If lastExecutionTimestamp is not set or a week has passed, run the effect
    if (
      !lastExecutionTimestamp ||
      currentTimestamp - Number(lastExecutionTimestamp) >=
        7 * 24 * 60 * 60 * 1000
    ) {
      (async function () {
        const res = await SetDragons();
        console.log("running setDragon");
        localStorage.setItem(
          "lastExecutionTimestamp",
          currentTimestamp.toString()
        );
      })();
    }
    (() => {
      startTransition(async () => {
        const res = await GetDragons();
        console.log("running getDragon");
        if (res != null) {
          const formattedData = res.map((item) => ({
            dragon_name: item.dragon_name,
            dragon_image: item.dragon_image || "",
          }));
          setDragonData(formattedData);
          setFilteredData(formattedData);
        }
      });
    })();
  }, []);

  const memoizedDragonData = useMemo(() => {
    return filteredData.map((item, index) => (
      <div
        key={index}
        id={item.dragon_name}
        className="h-36 w-fit p-5 rounded-2xl bg-slate-100 hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 drop-shadow-lg cursor-pointer"
      >
        <h1 className="text-zinc-800 dark:text-slate-100">
          {item.dragon_name}
        </h1>
        <Image
          src={item.dragon_image}
          width={70}
          height={70}
          alt={item.dragon_name}
          className="object-contain"
        />
      </div>
    ));
  }, [filteredData]);

  const handleFilter = debounce((searchTerm: string) => {
    const filteredDragons = dragonData.filter((dragon) =>
      dragon.dragon_name.toUpperCase().includes(searchTerm.toUpperCase())
    );
    setFilteredData(filteredDragons); // Update the filtered data state
  }, 500);

  return (
    <main className="flex min-h-screen max-w-screen flex-col bg-slate-100 dark:bg-zinc-900 items-center justify-between gap-5 p-24">
      <ThemeSwitcher className="absolute top-10 left-10" />
      <SearchBar onChange={(e) => handleFilter(e.target.value as string)} />
      <div className="w-full gap-2 flex flex-row flex-wrap">
        {isPending
          ? lodash
              .range(0, 100)
              .map((item: number) => (
                <div
                  key={item}
                  className="h-36 w-36 p-5 rounded-2xl bg-slate-300 dark:bg-zinc-800 drop-shadow-lg animate-pulse"
                ></div>
              ))
          : memoizedDragonData}
      </div>
    </main>
  );
}
