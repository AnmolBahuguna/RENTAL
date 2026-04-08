import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const desktopBanners = [
  'https://ik.imagekit.io/goeazy/BANNER%201st.webp',
  'https://ik.imagekit.io/goeazy/BANNER%202nd.webp',
  'https://ik.imagekit.io/goeazy/BANNER%203rd.webp'
];

export const BannerSlider = () => {
  const banners = desktopBanners;

  return (
    <div className="w-full bg-slate-50 px-4 sm:px-10 lg:px-20 py-3 sm:py-4">
      <div className="w-full mx-auto overflow-hidden rounded-md sm:rounded-lg shadow-sm border border-gray-100">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full"
        >
          {banners.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="w-full flex items-center justify-center">
                <img 
                  src={src} 
                  alt={`GoEazy Banner ${index + 1}`} 
                  className="w-full h-auto object-contain"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
