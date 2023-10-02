"use server";

import supabase from "./supabase";
import axios from "axios";
import { load } from "cheerio";

export async function SetDragons() {
  const response = await axios.get(
    "https://dragoncity.fandom.com/wiki/Dragons/All"
  );

  const $ = load(response.data);
  const articles = $(".bm_dragon_name");

  const structuredData = [];

  for (const article of articles.toArray()) {
    const imgElement = $(article).find(".bm_dragon_square a img");
    const imageUrl = imgElement.attr("data-src") || imgElement.attr("src");
    const dragonName = $(article).find("span").text();

    structuredData.push({ imageUrl, dragonName });
  }

  for (const data of structuredData) {
    const { error } = await supabase
      .from("dragons")
      .insert({ dragon_name: data.dragonName, dragon_image: data.imageUrl });
    if (error) {
      console.error(error);
    }
  }

  return structuredData;
}
