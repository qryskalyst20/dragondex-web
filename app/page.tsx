"use client";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useEffect, useState, useMemo, useTransition, useRef } from "react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import lodash, { debounce } from "lodash";

export default function Home() {
  const [dragonData, setDragonData] = useState([
    { dragon_name: "", dragon_image: "" },
  ]);
  const [filteredData, setFilteredData] = useState(dragonData);
  const [page, setPage] = useState(49); // Page number for pagination
  const [isPending, startTransition] = useTransition();
  const loadMoreButtonRef = useRef(null); // Create a ref for the button

  useEffect(() => {
    (() => {
      startTransition(async () => {
        const res = await fetch("api/dragons");
        if (res != null) {
          const data = await res.json(); // Convert response to JSON
          console.log(data);
          const formattedData = data.map(
            (item: { dragonName: string; imageUrl: string }) => ({
              dragon_name: item.dragonName,
              dragon_image: item.imageUrl || "",
            })
          );
          setDragonData(formattedData);
          setFilteredData(formattedData);
        }
      });
    })();
  }, [page]);

  // Use the Intersection Observer API to detect when the button is in view
  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin
      threshold: 0.1, // Trigger when at least 50% of the button is in view
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Load more data when the button is in view
        setPage((prevPage: number) => prevPage + 50);
      }
    }, options);

    // Observe the load more button
    if (loadMoreButtonRef.current) {
      observer.observe(loadMoreButtonRef.current);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      if (loadMoreButtonRef.current) {
        observer.unobserve(loadMoreButtonRef.current);
      }
    };
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
      <button ref={loadMoreButtonRef}>Load More</button>
    </main>
  );
}
