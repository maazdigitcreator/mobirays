import React from 'react'
import singleNewsImg from '../assets/singleNewsImage.png'

const SingleNews = ({ title, description, date, image }) => {
  return (
    <div className="mb-3 cursor-pointer sm:mb-4">
      <div className="flex gap-2 py-2 sm:gap-4 sm:py-4">
        <div className="w-[34%] shrink-0 sm:w-[40%]">
          <img src={image || singleNewsImg} alt="phone" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h2 className="line-clamp-4 text-[11px] font-semibold leading-tight text-[#0E4C8C] sm:text-[29px] sm:leading-9">
              {title || "Samsung Galaxy S20 Fan Edition is Available for Pre-order in Pakistan; A Premium Device for a Not-so-premium Price"}
            </h2>
            <p className="mt-1 line-clamp-3 text-[9px] leading-tight text-[#41403E] sm:mt-2 sm:text-[17px] sm:leading-6">
              {description || "Samsung's true flagships and their ever-inflating price tags have left a gap in their portfolio for the so-called \"value\" flagships. Brands like OnePlus traditionally found a niche in that segment...."}
            </p>
          </div>
          <p className="mt-1 text-right text-[9px] font-semibold text-[#41403E] sm:mt-2 sm:text-[17px]">
            {date || "October 3, 2020"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SingleNews
