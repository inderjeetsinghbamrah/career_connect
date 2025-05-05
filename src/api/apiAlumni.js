import supabaseClient from "@/utils/supabase";

export async function addMentorDetails(token, _, mentorData) {
    console.log(mentorData);
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("alumni")
        .insert([mentorData]);

    if (error) {
      console.error(error);
      throw new Error("Data Already Saved");
    }

    return data;
}

export async function fetchMentors(token) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("alumni")
        .select("recruiter_id, name, designation, company_name, expertise_area, alma_mater")
        .eq("available_to_mentor", true)
        .gt("slots_for_mentoring", [])
        .order("name");

    if (error) {
      console.error(error);
      throw new Error("Data Already Saved");
    }

    return data;
}

// Book a slot for the user in Supabase
export async function bookSlot (slotTime, userId) {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          slot_time: slotTime,
          user_id: userId,
        },
      ]);

    if (error) throw new Error(error.message);
    return data;
  }
