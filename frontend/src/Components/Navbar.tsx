// (React import not required with the new JSX transform)
import logo from "../assets/logo.png";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: () => void;
}

const Navbar = ({
  searchQuery = "",
  onSearchChange,
  onSearch,
}: NavbarProps) => {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <nav className="w-full bg-[#F9F9F9] shadow-[0px_2px_16px_0px_#0000001A]">
      <div className="max-w-[1440px] h-[87px] mx-auto flex items-center justify-between px-6 sm:px-12 md:px-[80px] lg:px-[124px] py-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Highway Delite Logo"
            className="w-[100px] h-[55px] object-contain"
          />
        </div>

        {/* Search Section */}
        <div className="hidden md:flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search experiences"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-4 py-3 w-64 bg-[#EDEDED] text-[#727272] placeholder-gray-500 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="px-5 py-3 bg-[#FFD643] text-[#161616] font-medium rounded-[8px] hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition-colors duration-200"
          >
            Search
          </button>
        </div>

        {/* Mobile Search Icon */}
        <div className="md:hidden">
          <button
            type="button"
            className="p-2 rounded-md bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition-colors duration-200"
          >
            🔍
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
