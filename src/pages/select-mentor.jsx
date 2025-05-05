import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchMentors, bookSlot } from "@/api/apiAlumni"; // Adjust the import path as necessary

const MentorSlotSelector = ({ userId }) => {
    const { toast } = useToast();
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [slots, setSlots] = useState([]);

    const loadMentors = async () => {
      try {
        const data = await fetchMentors(); // Fetch available mentors only
        setMentors(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch mentors.",
          variant: "destructive",
        });
      }
    };

    const loadSlots = async (mentorId) => {
      const mentor = mentors.find((m) => m.id === mentorId);
      setSlots(mentor?.slots || []); // Set slots from the mentor's array
      setSelectedSlot(null); // Reset selected slot
    };

    const confirmBooking = async () => {
      if (!selectedSlot) return;

      try {
        await bookSlot(selectedSlot, userId);
        toast({
          title: "Slot Booked",
          description: "You are now scheduled for your session.",
          variant: "default",
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
      loadMentors(); // Load only available mentors
    }, []);

    useEffect(() => {
      if (selectedMentor) {
        loadSlots(selectedMentor); // Load slots when a mentor is selected
      }
    }, [selectedMentor]);

    return (
      <div className="p-4 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-center">Book a Mentoring Slot</h2>

        {/* Step 1: Mentor Selection */}
        <div>
          <h3 className="font-semibold mb-2">Step 1: Select Mentor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors?.map((mentor) => (
              <Card
                key={mentor.id}
                className={`cursor-pointer ${
                  selectedMentor === mentor.id ? "border-blue-500 border-2" : ""
                }`}
                onClick={() => setSelectedMentor(mentor.id)}
              >
                <CardContent className="p-4">
                  <p className="font-medium">{mentor.name}</p>
                  <p className="text-sm text-gray-500">{mentor.designation}</p>
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
      </div>
    );
  };

  export default MentorSlotSelector;
