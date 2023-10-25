import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { parse } from "node-html-parser";

export async function GET(request: NextRequest) {
  const res = await axios.get("https://dragoncity.fandom.com/wiki/Dragons/All");

  const root = parse(res.data);
  const articles = root.querySelectorAll(".bm_dragon_name");
  const dragons = [];
  for (const article of articles) {
    const imgElement = article.querySelector(".bm_dragon_square a img");
    const imageUrl =
      imgElement?.getAttribute("data-src") || imgElement?.getAttribute("src");
    const dragonName = article.querySelector("span")?.text;
    if (imageUrl && dragonName) {
      dragons.push({ imageUrl, dragonName });
    }
  }

  return NextResponse.json(dragons);
}
