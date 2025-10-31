import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import Home from "./Pages/Home";
import Details from "./Pages/Details";
import Checkout from "./Pages/Checkout";
import Result from "./Pages/Result";
import Navbar from "./Components/Navbar";

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const location = useLocation();

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // If query is empty, clear the search immediately
    if (query === "") {
      setActiveSearch("");
    }
  };

  // Only show search on home page
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-gray-900">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />
      <Routes>
        <Route
          path="/"
          element={<Home searchQuery={isHomePage ? activeSearch : ""} />}
        />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
