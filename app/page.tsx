"use client";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useEffect, useState, useMemo } from "react";
import { SetDragons } from "@/backend/SetDragons";
import { GetDragons } from "@/backend/GetDragons";
import Image from "next/image";
import useNextBlurhash from "use-next-blurhash";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [dragonData, setDragonData] = useState([
    { dragon_name: "", dragon_image: "" },
  ]);

  const [blurDataUrl] = useNextBlurhash("LEHV6nWB2yk8pyo0adR*.7kCMdnj");

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
        localStorage.setItem(
          "lastExecutionTimestamp",
          currentTimestamp.toString()
        );
      })();
    }

    (async function () {
      const res = await GetDragons();
      if (res != null) {
        const formattedData = res.map((item) => ({
          dragon_name: item.dragon_name,
          dragon_image: item.dragon_image || "",
        }));
        setDragonData(formattedData);
      }
    })();
  }, []);

  const memoizedDragonData = useMemo(() => {
    return dragonData.map((item, index) => (
      <div
        key={index}
        className="h-fit w-fit p-5 rounded-2xl bg-slate-300 dark:bg-zinc-950"
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
          placeholder="blur"
          blurDataURL={blurDataUrl} // use the base64 image as a placeholder
        />
      </div>
    ));
  }, [dragonData, blurDataUrl]);

  function handleFilter(searchTerm: string) {
    const filteredDragons = dragonData.filter((dragon) =>
      dragon.dragon_name.toUpperCase().includes(searchTerm.toUpperCase())
    );
    setDragonData(filteredDragons);
  }

  return (
    <main className="flex min-h-screen max-w-screen flex-col bg-slate-100 dark:bg-zinc-900 items-center justify-between gap-5 p-24">
      <ThemeSwitcher className="absolute top-10 left-10" />
      <SearchBar onChange={(e) => handleFilter(e.target.value as string)} />
      <div className="w-full gap-2 flex flex-row flex-wrap">
        {memoizedDragonData}
      </div>
    </main>
  );
}
