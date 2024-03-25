import React, { useEffect, useState } from "react";

const AdComponent = ({ pageType }) => {
  const [ads, setAds] = useState([]);
  const imageBaseUrl = "http://localhost:5000/"; // Define your image base URL

  useEffect(() => {
    fetch("http://localhost:5000/api/ads/ads")
      .then((res) => res.json())
      .then((data) => {
        const filteredAds = data.filter((ad) => {
          const currentDate = new Date();
          const startDate = new Date(ad.startDate);
          const endDate = new Date(ad.endDate);
          const isActive = ad.active;

          try {
            const pagesArrayString = JSON.parse(ad.pages[0]);
            const pagesArray = JSON.parse(pagesArrayString);
            const isCurrentPageAd = pagesArray.includes(pageType);

            return (
              isActive &&
              isCurrentPageAd &&
              currentDate >= startDate &&
              currentDate <= endDate
            );
          } catch (error) {
            console.error("Error parsing pages:", error);
            return false;
          }
        });
        setAds(filteredAds);
      })
      .catch((error) => console.error("Failed to fetch ads", error));
  }, [pageType]);

  return (
    <div>
      {ads.map((ad) => (
        <a
          key={ad._id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 "
        >
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={`${imageBaseUrl}${ad.imageUrlDesktop}`}
            />
            <img
              src={`${imageBaseUrl}${ad.imageUrlMobile}`}
              alt={ad.title}
              className="w-full h-[132px]"
            />
          </picture>
        </a>
      ))}
    </div>
  );
};

export default AdComponent;
