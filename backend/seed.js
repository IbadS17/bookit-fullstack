require("dotenv").config();
const mongoose = require("mongoose");
const Experience = require("./models/Experience");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Experience.deleteMany();
  const raw = [
    {
      title: "Mountain Trekking",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      location: "Manali",
      image: "https://images.unsplash.com/photo-1665724233211-02a7afbb8b36",
      price: 8000,
      dates: generateDates(),
    },
    {
      title: "Kayaking Adventure",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      location: "Udupi",
      image: "https://images.unsplash.com/photo-1588472235276-7638965471e2",
      price: 999,
      dates: generateDates(),
    },
    {
      title: "Desert Safari",
      description: "Ride across golden dunes and enjoy a stunning sunset.",
      location: "Jaisalmer",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      price: 5500,
      dates: generateDates(),
    },
    {
      title: "Paragliding Experience",
      description: "Fly over scenic valleys and mountains with trained pilots.",
      location: "Bir Billing",
      image: "https://images.unsplash.com/photo-1592208128295-5aaa34f1d72b",
      price: 4500,
      dates: generateDates(),
    },
    {
      title: "Scuba Diving",
      description: "Dive deep into the coral world with certified instructors.",
      location: "Goa",
      image: "https://images.unsplash.com/photo-1682687982502-1529b3b33f85",
      price: 6000,
      dates: generateDates(),
    },
    {
      title: "Camping by the Lake",
      description: "Relax under the stars and enjoy the peaceful lakeside.",
      location: "Pawna Lake",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      price: 2500,
      dates: generateDates(),
    },
    {
      title: "Tea Estate Walk",
      description: "A soothing guided walk through lush tea plantations.",
      location: "Munnar",
      image:
        "https://plus.unsplash.com/premium_photo-1697730430306-7c8d36cb3722",
      price: 1200,
      dates: generateDates(),
    },
    {
      title: "Wildlife Safari",
      description: "Spot tigers, elephants, and deer in their natural habitat.",
      location: "Jim Corbett",
      image:
        "https://plus.unsplash.com/premium_photo-1664302119236-07ca7a772c9e",
      price: 3500,
      dates: generateDates(),
    },
  ];

  // Helper function to randomize available/sold-out
  function generateDates() {
    const times = ["6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM"];
    const statuses = ["available", "sold out"];
    const dates = ["Nov 1", "Nov 2", "Nov 3", "Nov 4", "Nov 5"];

    return dates.map((date) => ({
      date,
      times: times.map((time) => ({
        time,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      })),
    }));
  }

  module.exports = raw;

  // transform raw structure into flat slots: { date, time, isBooked, availability }
  const docs = raw.map((exp) => {
    const slots = [];
    for (const d of exp.dates) {
      for (const t of d.times) {
        const isBooked = t.status === "sold out";
        const availability = isBooked ? 0 : Math.floor(Math.random() * 4) + 2; // 2-5 if available
        slots.push({
          date: d.date,
          time: t.time,
          isBooked,
          availability,
        });
      }
    }
    return { ...exp, slots };
  });

  await Experience.insertMany(docs);

  console.log("✅ Seeded experiences");
  mongoose.disconnect();
});
