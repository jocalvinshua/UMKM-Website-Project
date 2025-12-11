import { assets } from "../assets/assets";

export function MainBanner() {
    return (
        <div className="relative">
            <img src={assets.main_banner_bg} alt="Main Banner" className="w-full hidden md:block" />
            <img src={assets.main_banner_bg_sm} alt="Main Banner" className="w-full md:hidden" />
            <div className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-left mb-4 leading-tight text-black">
                    Welcome to Our Store!
                </h1>
                <p className="text-lg md:text-2xl mb-6 text-black">Find the best products here</p>
                <button className="px-6 py-3 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Shop Now
                </button>
            </div>
        </div>
    );
}