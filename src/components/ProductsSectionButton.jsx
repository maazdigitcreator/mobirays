import { Link } from 'react-router-dom'

const ProductsSectionButton = ({ showMoreLink, comingSoonLink }) => {
    return (
        <div className="mt-5">
            <div className="w-full text-[#0580A5] rounded-full py-1 sm:text-lg text-sm font-medium transition-colors relative flex gap-5 sm:flex-row items-center sm:justify-end justify-center">
                <Link to={showMoreLink} className="bg-white w-fit border-2 rounded-full border-[#0580A5] sm:px-15 px-3 sm:py-1 py-1 z-10 hover:cursor-pointer hover:bg-[#0580A5] hover:text-white transition-colors">Show More &gt;&gt;</Link>
                <div className="absolute w-full sm:h-[3px] h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                <Link to={comingSoonLink || "/coming-soon"} className="bg-white w-fit border-2 sm:mr-15 rounded-full border-[#FF0008] sm:px-13 px-3 sm:py-1 py-1 z-10 hover:cursor-pointer hover:bg-[#FF0008] hover:text-white transition-colors">Coming Soon &gt;&gt;</Link>
            </div>
        </div>
    )
}

export default ProductsSectionButton