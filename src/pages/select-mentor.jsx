import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchMentors, bookSlot, fetchMyBookedSlots } from "@/api/apiAlumni"; // Adjust the import path as necessary

const MentorSlotSelector = ({ userId }) => {
    const { toast } = useToast();
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [slots, setSlots] = useState([]);
    const { isLoaded, user } = useUser();

    const {
        fn: fnFetchAlumni,
        loading: loadingFetchAlumni,
        data: dataFetchAlumni,
        error: errorFetchAlumni,
    } = useFetch(fetchMentors);



    const loadSlots = async (mentorId) => {
        const mentor = dataFetchAlumni?.find((m) => m.recruiter_id === mentorId);
        setSlots(mentor?.slots_for_mentoring || []); // Set slots from the mentor's array
        setSelectedSlot(null); // Reset selected slot
    };

    const {
        fn: fnConfirmBooking,
        loading: loadingConfirmBooking,
        data: dataConfirmBooking,
        error: errorConfirmBooking,
    } = useFetch(bookSlot);

    const {
        fn: fnFetchMyBookings,
        loading: loadingMyBookings,
        data: myBookings,
        error: errorMyBookings,
    } = useFetch(fetchMyBookedSlots);

    const confirmBooking =  () => {
      if (!selectedSlot) return;
      try {
        fnConfirmBooking(selectedSlot, user?.id, selectedMentor);
        toast({
          title: "Slot Booked",
          description: "You are now scheduled for your session.",
          variant: "green",
        });
      } catch (error) {
        toast({
          title: "Booking Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    };

    useEffect(() => {
      if(isLoaded) fnFetchAlumni() // Load only available mentors
    }, [isLoaded]);

    useEffect(() => {
      if (selectedMentor) {
          loadSlots(selectedMentor); // Load slots when a mentor is selected
      }
    }, [selectedMentor]);

    useEffect(() => {
        if (isLoaded && user?.id) {
          fnFetchMyBookings(user?.id);
        }
      }, [isLoaded]);
    return (
      <div className="p-4 max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-center">Book a Mentoring Slot</h2>


        {/* Step 1: Mentor Selection */}
        <div>
          <h3 className="font-semibold mb-2">Step 1: Select Mentor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataFetchAlumni?.map((mentor,id) => (
              <Card
                key={id}
                className={`cursor-pointer ${
                  selectedMentor === mentor.recruiter_id ? "border-blue-500 border-2" : ""
                }`}
                onClick={() => setSelectedMentor(mentor.recruiter_id)}
              >
                <CardContent className="p-4">
                  <p className="font-medium">{mentor.name}</p>
                  <p className="text-sm text-gray-500">{mentor.current_designation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Step 2: Slot Selection */}
        {selectedMentor && (
          <div>
            <h3 className="font-semibold mb-2">Step 2: Select a Slot</h3>
            <div className="grid gap-4">
              {slots?.map((slot, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer ${
                    selectedSlot === slot ? "border-blue-500 border-2" : ""
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <CardContent className="p-4">
                    <p><strong>Start:</strong> {new Date(slot).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <Button
                onClick={confirmBooking}
                disabled={!selectedSlot}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
            )}
            {/* My Bookings Section */}
<div className="mt-10">
  <h3 className="text-lg font-semibold mb-2">Your Booked Slots</h3>

  {loadingMyBookings ? (
    <p>Loading...</p>
  ) : errorMyBookings ? (
    <p className="text-red-500">Failed to load your bookings.</p>
  ) : myBookings?.length > 0 ? (
    <div className="grid gap-4">
      {myBookings.map((booking, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <p><strong>Mentor:</strong> {booking.alumni.name}</p>
            <p><strong>Slot:</strong> {new Date(booking.slots_for_mentoring).toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">You haven’t booked any slots yet.</p>
  )}
</div>
      </div>
    );
  };

  export default MentorSlotSelector;
