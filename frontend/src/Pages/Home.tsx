import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ExperienceCard from "../Components/ExprienceCard";

interface Experience {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
}

interface HomeProps {
  searchQuery?: string;
}

export default function Home({ searchQuery = "" }: HomeProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://bookit-fullstack-51wv.onrender.com/api/experiences")
      .then((res) => setExperiences(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter experiences based on search query
  const filteredExperiences = useMemo(() => {
    if (!searchQuery.trim()) {
      return experiences;
    }

    const query = searchQuery.toLowerCase().trim();
    return experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.location.toLowerCase().includes(query)
    );
  }, [experiences, searchQuery]);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  if (filteredExperiences.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-center mt-20 text-gray-500">
          No experiences found matching "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredExperiences.map((exp) => (
        <Link key={exp._id} to={`/details/${exp._id}`} className="no-underline">
          <ExperienceCard
            imageUrl={exp.image}
            title={exp.title}
            location={exp.location}
            description={exp.description}
            price={exp.price}
          />
        </Link>
      ))}
    </div>
  );
}
