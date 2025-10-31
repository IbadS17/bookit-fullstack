import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/experiences/${id}`)
      .then((res) => setExperience(res.data))
      .catch(console.error);
  }, [id]);

  // Do NOT auto-select date/time on load. User must explicitly choose both.
  useEffect(() => {
    if (!experience) {
      setSelectedDate(null);
      setSelectedTime(null);
      return;
    }
    // clear selections when experience changes
    setSelectedDate(null);
    setSelectedTime(null);
  }, [experience]);

  if (!experience)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  const uniqueDates = Array.from(
    new Set(experience.slots.map((s: any) => s.date))
  ) as string[];

  // derive unique times across all dates for display when no date selected
  const uniqueTimes = Array.from(
    new Set(experience.slots.map((s: any) => s.time))
  ) as string[];

  const getTimeAvailability = (time: string) => {
    if (selectedDate) {
      // If date is selected, get availability for that specific date/time
      const slot = experience.slots.find(
        (s: any) => s.date === selectedDate && s.time === time
      );
      return slot
        ? { isBooked: slot.isBooked, availability: slot.availability }
        : { isBooked: true, availability: 0 };
    } else {
      // If no date selected, show if this time is available on ANY date
      const slotsWithTime = experience.slots.filter(
        (s: any) => s.time === time
      );
      const anyAvailable = slotsWithTime.some((s: any) => !s.isBooked);
      const maxAvailability = anyAvailable
        ? Math.max(
            ...slotsWithTime
              .filter((s: any) => !s.isBooked)
              .map((s: any) => s.availability || 0)
          )
        : 0;
      return { isBooked: !anyAvailable, availability: maxAvailability };
    }
  };

  const price = experience.price;
  const subtotal = price * quantity;
  const taxes = Math.round(subtotal * 0.06); // 6% tax for display
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const slot = { date: selectedDate, time: selectedTime, qty: quantity };
    navigate(`/checkout/${experience._id}`, { state: { slot, experience } });
  };

  return (
    <>
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#838383] hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Details</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: content */}
        <div className="lg:col-span-2">
          <img
            src={experience.image}
            alt={experience.title}
            className="rounded-xl w-full h-96 object-cover"
          />

          <h2 className="mt-6 text-2xl font-medium">{experience.title}</h2>
          <p className="text-[#6C6C6C] mt-3 font-normal">
            {experience.description}
          </p>

          <div className="mt-8">
            <h4 className="font-medium text-lg mb-2">Choose date</h4>
            <div className="flex gap-3">
              {uniqueDates.map((d: string) => (
                <button
                  key={d}
                  onClick={() => {
                    // select only date; user must pick a time explicitly
                    setSelectedDate(d);
                    setSelectedTime(null);
                  }}
                  className={`px-4 py-2 rounded-md border ${
                    selectedDate === d
                      ? "bg-yellow-400 text-[#161616] text-[14px] font-medium"
                      : "bg-white text-[#838383] text-[14px] font-medium"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-lg mb-2">Choose time</h4>
            <div className="flex flex-wrap gap-3">
              {/* Show all unique times even if date not selected. */}
              {uniqueTimes.map((time: string, i: number) => {
                const { isBooked, availability } = getTimeAvailability(time);
                return (
                  <button
                    key={i}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-md border flex items-center gap-1 ${
                      isBooked
                        ? "bg-[#CCCCCC] text-[#838383] cursor-not-allowed text-[14px]"
                        : selectedTime === time
                        ? "bg-yellow-400 text-black"
                        : "bg-white text-[#838383] hover:bg-gray-100 "
                    }`}
                  >
                    <span>{time}</span>
                    {isBooked ? (
                      <span>sold out</span>
                    ) : (
                      <span className="text-[#FF4C0A] text-[10px] font-medium">
                        - {availability} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              All times are in IST (GMT +5:30)
            </p>
          </div>

          <div className="mt-8">
            <h4 className="font-medium text-lg mb-2">About</h4>
            <div className="p-3 bg-[#EEEEEE] rounded-md text-sm text-gray-600">
              Scenic routes, trained guides, and safety briefing. Minimum age
              10.
            </div>
          </div>
        </div>

        {/* Right: booking card */}
        <div>
          <div className="px-6 py-4 bg-[#EFEFEF] rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Starts at</span>
              <span className="font-semibold">₹{price}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="bg-[#EFEFEF] rounded border"
                >
                  −
                </button>
                <span className="text-[12px]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className=" bg-[#EFEFEF] rounded border"
                >
                  +
                </button>
              </div>
            </div>

            <div className="">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="py-4 flex justify-between text-sm text-gray-600 mt-2">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>
            </div>

            <div className="border-t-2 py-2 flex justify-between items-center mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">₹{total}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-[#FFD643] text-[#161616] py-3 px-5 rounded-md font-semibold hover:bg-yellow-500 disabled:bg-[#D7D7D7] disabled:cursor-not-allowed disabled:text-[#7F7F7F]"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
