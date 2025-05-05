// RegisterAsMentor.tsx
import { z } from "zod";
import {useState, useEffect} from "react";
import { useUser } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarLoader } from "react-spinners";
import {Navigate, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // assumes you use a calendar component
import useFetch from "@/hooks/use-fetch";
import { Controller } from "react-hook-form";
import { addMentorDetails } from "@/api/apiAlumni"; // create this API function
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const schema = z.object({
  alumni_status: z.boolean(),
    available_to_mentor: z.boolean(),
  name:z.string().min(1, "Name is required"),
  alma_mater: z.string().min(1, "Alma Mater is required"),
  expertise_area: z.string().min(1, "Expertise Area is required"),
  current_designation: z.string().min(1, "Current Designation is required"),
  company_name: z.string().min(1, "Company Name is required"),
  slots_for_mentoring: z.array(z.date()).nonempty("At least one mentoring slot is required"),
});

const RegisterAsMentor = () => {
    const { toast } = useToast();
const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("09:00");
    const [slots, setSlots] = useState([]);


const addSlot = () => {
    if (!selectedDate || !selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const newSlot = new Date(selectedDate);
    newSlot.setHours(hours);
    newSlot.setMinutes(minutes);
    newSlot.setSeconds(0);

    const alreadyAdded = slots.find(
      (s) => new Date(s).getTime() === newSlot.getTime()
    );
    if (!alreadyAdded) {
      const updatedSlots = [...slots, newSlot];
      setSlots(updatedSlots);
        setValue("slots_for_mentoring", updatedSlots);
        console.log("Updated slots:", updatedSlots);
    }
};

const removeSlot = (indexToRemove) => {
    const updatedSlots = slots.filter((_, index) => index !== indexToRemove);
    setSlots(updatedSlots);
    setValue("slots_for_mentoring", updatedSlots);
    console.log("Updated slots after removal:", updatedSlots);
  };

  const {
    register,
    handleSubmit,
      setValue,
      reset,
      control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
      defaultValues: {
      available_to_mentor: false,
      alumni_status: false,
      name:"",
      alma_mater: "",
      expertise_area: "",
      current_designation: "",
      company_name: "",
      slots_for_mentoring: [],
    },
  });

  const {
    fn: fnAddMentor,
    loading: loadingAddMentor,
    error:errorAddMentor,
  } = useFetch(addMentorDetails, {
      onSuccess: (data) => {
        toast({
          title: "Mentor registered successfully",
          description: "You have been registered as a mentor.",
          variant: "default",
        });
        reset();
        setSlots([]);
        navigate("/jobs");
      }
    , onError: (error) => {
        if (error?.message === "Data Already Saved") {
          toast({
            title: "Mentor already registered",
            description: "You have already registered as a mentor.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error?.message || "An error occurred while registering.",
            variant: "destructive",
          });
        }
      },
  });



    const onSubmit = (formData) => {
    fnAddMentor({
        ...formData,
        slots_for_mentoring: formData.slots_for_mentoring.map((slot) => slot.toISOString()),
        recruiter_id: user?.id,
    });

    };



if (!isLoaded) return <BarLoader width={"100%"} color="#36d7b7" />;

if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
}
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Register as Mentor</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <Controller
  name="alumni_status"
  control={control}
  render={({ field }) => (
    <label className="flex items-center gap-2">
      <Checkbox
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      Are you an Alumni?
    </label>
  )}
/>
{errors.alumni_status && <p className="text-red-500">{errors.alumni_status.message}</p>}

<Controller
  name="available_to_mentor"
  control={control}
  render={({ field }) => (
    <label className="flex items-center gap-2">
      <Checkbox
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      Available for Mentoring?
    </label>
  )}
/>
{errors.available_to_mentor && <p className="text-red-500">{errors.available_to_mentor.message}</p>}

        <Input placeholder="Name" {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <Input placeholder="Alma Mater" {...register("alma_mater")} />
        {errors.alma_mater && <p className="text-red-500">{errors.alma_mater.message}</p>}

        <Input placeholder="Expertise Area" {...register("expertise_area")} />
        {errors.expertise_area && <p className="text-red-500">{errors.expertise_area.message}</p>}

        <Input placeholder="Current Designation" {...register("current_designation")} />
        {errors.current_designation && <p className="text-red-500">{errors.current_designation.message}</p>}

        <Input placeholder="Company Name" {...register("company_name")} />
        {errors.company_name && <p className="text-red-500">{errors.company_name.message}</p>}

        <div className="flex items-center justify-center gap-4 text-white">
            <div className="flex flex-col">
                <label className="block font-medium">Pick a Date</label>
                    <Calendar
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date)}
                    mode="single"
                    className="rounded-md border"
                />
            </div>
            <div className="flex flex-col">
                <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    placeholder="Pick a Time"      // Adjusted text color
                />
                  </div>
                  <div className="flex justify-center mt-4">
        <Button type="button" onClick={addSlot} className="px-6 py-2 bg-blue-500 text-white rounded">
          Add Slot
        </Button>
      </div>
      </div>

      {/* Time Selection */}


      {/* Add Slot Button */}


      {slots.length > 0 && (
        <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr. No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {slots.map((slot, index) => (

            <TableRow key={index}>
                  <TableCell>{slot.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
              })}</TableCell>
              <TableCell>{slot.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}</TableCell>
              <TableCell>{slot.toLocaleDateString('en-US', {
            weekday: 'long',
          })}</TableCell>
              <TableCell className="text-right"><Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSlot(index)}
                    >
                      Remove
                    </Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}


      {/* Error Display */}
      {errors.slots_for_mentoring && (
        <p className="text-red-500">{errors.slots_for_mentoring.message}</p>
      )}
        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorAddMentor?.message && (
          <p className="text-red-500">{errorAddMentor?.message}</p>
        )}
        {loadingAddMentor    && <BarLoader width={"100%"} color="#36d7b7" />}
        <div className="flex items-center align-middle justify-around"><Button type="submit" variant="blue" size="lg">Submit</Button></div>
      </form>
    </div>
  );
};

export default RegisterAsMentor;
