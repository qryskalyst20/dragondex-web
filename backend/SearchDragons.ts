import supabase from "./supabase";

export async function SearchDragons(search: string) {
  const { data, error } = await supabase
    .from("dragons")
    .select("*")
    .textSearch("name", search);
  if (error) {
    console.log("error", error);
  } else {
    return data;
  }
}
