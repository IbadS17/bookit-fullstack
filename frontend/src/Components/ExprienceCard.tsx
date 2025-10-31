import React from "react";

interface ExperienceCardProps {
  imageUrl: string;
  title: string;
  location: string;
  description: string;
  price: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  imageUrl,
  title,
  location,
  description,
  price,
}) => {
  return (
    <div className="relative max-w-[280px] w-full rounded-[12px] flex flex-col items-start overflow-hidden font-['Inter',_sans-serif]">
      {/* Image Section */}
      <div className="w-full h-[170px] flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (
              e.target as HTMLImageElement
            ).src = `https://placehold.co/280x170/f0f0f0/333?text=${title.replace(
              /\s+/g,
              "+"
            )}`;
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-start p-4 gap-4 bg-[#F0F0F0] w-full">
        {/* Title + Location */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-[16px] leading-[20px] font-medium text-[#161616] truncate">
            {title}
          </h2>
          <span className="flex justify-center items-center px-2 py-1 bg-[#D6D6D6] rounded-[4px] text-[11px] font-medium text-[#161616] ml-4">
            {location}
          </span>
        </div>

        {/* Description */}
        <p className="w-full text-[12px] leading-[16px] font-normal text-[#6C6C6C] line-clamp-2">
          {description}
        </p>

        {/* Price + Button */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span className="text-[12px] leading-[16px] font-normal text-[#161616]">
              From
            </span>
            <span className="text-[20px] leading-[24px] font-medium text-[#161616]">
              ₹{price.toLocaleString("en-IN")}
            </span>
          </div>

          <button className="flex justify-center items-center px-2 py-[6px] bg-[#FFD643] rounded-[4px] text-[14px] font-medium text-[#161616] hover:bg-[#ffce2b] transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
