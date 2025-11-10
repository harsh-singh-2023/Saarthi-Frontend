import { useEffect, useState } from "react";
import axios from "axios";
import { Hotel, Star, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Hotel {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  location: string;
  amenities: string[];
  type: string;
}

interface HotelRecommendationsProps {
  destination: string;
  budget: string;
}

export function HotelRecommendations({
  destination,
  budget,
}: HotelRecommendationsProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination) return;
      setLoading(true);
      setError(null);

      try {
        // ✅ Backend call
        const res = await axios.get("http://localhost:5000/api/hotels", {
          params: {
            hotel_id: "191605", // static for now; can be made dynamic later
            adults: 2,
            currency_code: "INR",
          },
        });

        console.log("✅ API Response:", res.data);

        // Parse response safely
        const hotelData = res.data?.data || res.data || {};
        const name = hotelData.hotel_name || "Unnamed Hotel";
        const image =
          hotelData.photo?.main ||
          "https://via.placeholder.com/600x400?text=Hotel";
        const price =
          hotelData.price_breakdown?.gross_price ||
          hotelData.min_total_price ||
          4500;
        const rating = hotelData.review_score || 4.5;
        const reviews = hotelData.review_nr || 100;
        const amenities = hotelData.facilities
          ?.slice(0, 5)
          .map((f: any) => f.name) || [
          "Free WiFi",
          "Breakfast",
          "Air Conditioning",
          "Restaurant",
        ];

        // ✅ Format hotels array
        setHotels([
          {
            id: hotelData.hotel_id || 1,
            name,
            image,
            rating,
            reviews,
            price,
            location: destination,
            amenities,
            type: "luxury",
          },
        ]);
      } catch (err: any) {
        console.error("❌ Error fetching hotels:", err.message);
        setError("Failed to fetch hotel data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, budget]);

  if (loading) {
    return (
      <div className="bg-white p-6">
        <p className="text-center text-gray-500 animate-pulse">
          Fetching the best hotels in {destination}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-white p-6 text-center text-gray-600">
        <p>No hotels found for "{destination}". Try another destination.</p>
      </div>
    );
  }

  return (
    <div className="bg-white brutal-border brutal-shadow-lg p-6 rotate-[-0.3deg]">
      <div className="rotate-[0.3deg]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#a78bfa] p-3 brutal-border rotate-2">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-black text-xl font-semibold">
            Hotels in {destination}
          </h2>
        </div>

        {hotels.map((hotel, index) => (
          <div
            key={hotel.id}
            className="brutal-border bg-white overflow-hidden brutal-hover transition-transform mb-6"
            style={{ transform: `rotate(${[0.5, -0.3, 0.4][index % 3]}deg)` }}
          >
            <div className="grid md:grid-cols-3 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-full border-b-4 md:border-b-0 md:border-r-4 border-black">
                <ImageWithFallback
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#ffe66d] brutal-border px-4 py-2 rotate-[-3deg]">
                  <p className="text-2xl font-bold">₹{hotel.price}</p>
                  <p className="text-xs uppercase">per night</p>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-[#4ade80] brutal-border px-3 py-1">
                    <Star className="w-4 h-4 fill-white text-white" />
                    <span className="text-white">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ({hotel.reviews} reviews)
                  </span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="brutal-border bg-white px-3 py-1 text-sm"
                      style={{
                        backgroundColor:
                          ["#ffe66d", "#4ecdc4", "#ff6b6b", "#a78bfa"][
                            idx % 4
                          ] + "30",
                      }}
                    >
                      {amenity}
                    </div>
                  ))}
                </div>

                <Button className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white brutal-border brutal-shadow transition-all">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
