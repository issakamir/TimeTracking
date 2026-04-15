import {supabase} from "@/lib/supabase";
import {Activity, CategoryKey} from "@/app/day/[day]";

export async function fetchActivities(date: Date) {
  const formattedDate=date.toISOString().split("T")[0];
  const {data, error}=await supabase
    .from("activities")
    .select("id, date, category, hours, created_at")
    .eq("date", formattedDate)
    .order("created_at", {ascending:false})

  if(error) throw error;
  return (data ?? []) as Activity[];
}

export async function createActivity(params:{date:string, category:CategoryKey, hours:number}) {
  const {data, error}=await supabase
  .from("activities")
    .insert({
      date:params.date,
      category:params.category,
      hours:params.hours,
  })
    .select("id, date, category, hours, created_at")
    .single()

  if(error) throw error;
  return data as Activity;
}

export async function updateActivity(id:string, patch:Partial<Pick<Activity, "category" | "hours">>) {
  const {data, error}=await supabase
  .from("activities")
  .update(patch)
    .eq("id", id)
    .select("id, date, category, hours, created_at")
  .single()

  if(error) throw error;
  return data as Activity;
}

export async function deleteActivity(id:string) {
  const {error}=await supabase
    .from("activities")
    .delete()
    .eq("id", id)

  if(error) throw error;
}

export async function deleteActivitiesByDate(date: string) {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("date", date);

  if (error) throw error;
}