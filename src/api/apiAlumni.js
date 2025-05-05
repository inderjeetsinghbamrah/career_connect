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
export async function bookSlot(token, _, selectedSlot, candidateId, mentorId) {
    const supabase = await supabaseClient(token);
    console.log("Booking slot:", selectedSlot, candidateId, mentorId);

    const { data, error } = await supabase
      .from("slots_for_mentoring")
        .insert([{
            recruiter_id: mentorId,
            candidate_id: candidateId,
            slots_for_mentoring: selectedSlot,
      }]);

    if (error) throw new Error(error.message);
    return data;
}

export async function fetchMyBookedSlots(token, _, userId) {
    console.log("Fetching booked slots for user:", userId);
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("slots_for_mentoring")
        .select("*, alumni:alumni(name, current_designation, company_name, expertise_area, alma_mater)")
        .eq("candidate_id", userId);

    if (error) {
      console.error(error);
      throw new Error("Error Occurred");
    }
    console.log("Fetched booked slots:", data);
    return data;
}
