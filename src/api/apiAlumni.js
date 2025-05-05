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
    console.log(token)
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("alumni")
        .select("recruiter_id, name, current_designation, company_name, expertise_area, alma_mater, slots_for_mentoring")
        .eq("available_to_mentor", true)
        .order("name");
    console.log(data);

    if (error) {
      console.error(error);
      throw new Error("Data Already Saved");
    }

    return data;
}

// Book a slot for the user in Supabase
export async function bookSlot(token, _, selectedSlot) {
    console.log(selectedSlot);
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
      .from("slots_for_mentoring")
      .insert([bookingData]);

    if (error) throw new Error(error.message);
    return data;
  }
