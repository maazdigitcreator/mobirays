import React from 'react'
import singleNewsImg from '../assets/singleNewsImage.png'

const SingleNews = ({ title, description, date, image }) => {
  return (
    <div className="cursor-pointer mb-4">
      <div className="flex gap-4 py-4">
        <div className="w-[40%]">
          <img src={image || singleNewsImg} alt="phone" className="w-full h-full object-cover px-5" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-[#0E4C8C] sm:leading-9 leading-tight font-semibold text-base sm:text-[29px] line-clamp-4">
              {title || "Samsung Galaxy S20 Fan Edition is Available for Pre-order in Pakistan; A Premium Device for a Not-so-premium Price"}
            </h2>
            <p className="text-[#41403E] sm:text-[17px] text-sm mt-2 sm:leading-6 leading-tight line-clamp-3">
              {description || "Samsung's true flagships and their ever-inflating price tags have left a gap in their portfolio for the so-called \"value\" flagships. Brands like OnePlus traditionally found a niche in that segment...."}
            </p>
          </div>
          <p className="sm:text-[17px] text-sm font-semibold text-right text-[#41403E] mt-2">
            {date || "October 3, 2020"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SingleNews