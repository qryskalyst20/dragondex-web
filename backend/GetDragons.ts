import supabase from "./supabase";

export async function GetDragons(from: number, to: number) {
  const { data, error } = await supabase
    .from("dragons")
    .select("*")
    .range(from, to);
  if (error) {
    console.log("error", error);
  } else {
    return data;
  }
}
