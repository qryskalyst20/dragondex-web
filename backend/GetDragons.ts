import supabase from "./supabase";

export async function GetDragons() {
  const { data, error } = await supabase.from("dragons").select("*");
  if (error) {
    console.log("error", error);
  } else {
    return data;
  }
}
