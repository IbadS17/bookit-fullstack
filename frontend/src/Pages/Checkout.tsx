import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const { slot, experience } = state || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const initialPrice = experience ? experience.price * (slot?.qty || 1) : 0;
  const [price, setPrice] = useState<number>(initialPrice);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(true);

  const applyPromo = async () => {
    try {
      const res = await axios.post(
        `https://bookit-fullstack-51wv.onrender.com/api/promo/validate`,
        {
          code: promoCode,
        }
      );
      if (res.data.valid) {
        if (res.data.discount < 1)
          setPrice((p) => Math.round(p - p * res.data.discount));
        else setPrice((p) => Math.max(0, Math.round(p - res.data.discount)));
        alert("Promo applied!");
      } else alert("Invalid code");
    } catch (err) {
      alert("Promo validation failed");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!agree) return alert("Please agree to the terms");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://bookit-fullstack-51wv.onrender.com/api/bookings",
        {
          name,
          email,
          experienceId: experience._id,
          slot,
          totalPrice: price,
          promoCode,
        }
      );
      navigate("/result", {
        state: { success: res.data.success, booking: res.data.booking },
      });
    } catch (err: any) {
      // Check if it's a duplicate booking error
      if (err.response?.data?.isDuplicate) {
        alert(err.response.data.message);
        setLoading(false);
        return;
      }

      // Check if slot is no longer available
      if (err.response?.data?.message?.includes("no longer available")) {
        alert(
          "Sorry, this time slot is no longer available. Please select a different time."
        );
        navigate(-1); // Go back to details page
        return;
      }

      // For other errors, go to result page
      navigate("/result", {
        state: {
          success: false,
          message:
            err.response?.data?.message || "Booking failed. Please try again.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!experience || !slot)
    return (
      <p className="text-center mt-20 text-gray-500">Nothing to checkout</p>
    );

  const subtotal = experience.price * (slot.qty || 1);
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  return (
    <>
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
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
          <span className="font-medium">Checkout</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-[#EFEFEF] p-6 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-normal text-[#5B5B5B] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full border rounded p-3 bg-[#DDDDDD]"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-normal text-[#5B5B5B] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded p-3 bg-[#DDDDDD]"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 border rounded py-3 px-4 bg-[#DDDDDD]"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="bg-black text-white px-4 rounded-md"
              >
                Apply
              </button>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree((a) => !a)}
                className="w-3 h-3 accent-[#161616]"
              />
              <span className="text-sm text-[#5B5B5B] font-normal">
                I agree to the terms and safety policy
              </span>
            </label>
          </form>
        </div>

        <aside className="p-6 bg-[#EFEFEF] rounded-xl">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="text-base text-[#656565] mb-2 flex justify-between font-normal">
            <span>Experience</span>
            <span>{experience.title}</span>
          </div>
          <div className="text-base text-[#656565] mb-2 flex justify-between font-normal">
            <span>Date</span>
            <span>{slot.date}</span>
          </div>
          <div className="text-base text-[#656565] mb-2 flex justify-between font-normal">
            <span>Time</span>
            <span>{slot.time}</span>
          </div>
          <div className="text-base text-[#656565] mb-2 flex justify-between font-normal">
            <span>Qty</span>
            <span>{slot.qty || 1}</span>
          </div>

          <div className="my-3">
            <div className="flex justify-between font-normal text-base">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-base text-[#656565] my-2">
              <span>Taxes</span>
              <span>₹{taxes}</span>
            </div>
            <div className="border-t">
              <div className="flex justify-between text-lg font-bold mt-3">
                <span>Total</span>
                <span>₹{price || total}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-400 text-[#161616] w-full py-3 px-5 rounded-[8px] hover:bg-yellow-500 mt-4 text-[16px] leading-[20px] font-medium"
          >
            {loading ? "Processing..." : "Pay and Confirm"}
          </button>
        </aside>
      </div>
    </>
  );
}
