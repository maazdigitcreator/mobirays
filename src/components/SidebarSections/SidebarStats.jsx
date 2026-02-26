import React from 'react';

const SidebarStats = () => {
    return (
        <div className="flex flex-col gap-6">
            {/* Devices | Visitors */}
            <div>
                <div className="bg-[#0580A5] text-white px-4 py-2 flex justify-between items-center text-lg">
                    <span>Devices</span>
                    <div className="h-4 w-[1px] bg-white/50 mx-2"></div>
                    <span>Visitors</span>
                </div>
                <div className="text-sm">
                    {Array(8).fill({ name: "Xiaomi Poco X3", count: "64,853" }).map((item, idx) => (
                        <div key={idx} className={`flex justify-between items-center px-4 py-2 ${idx % 2 === 0 ? 'bg-[#67afc5]' : 'bg-white'}`}>
                            <div className="flex gap-2">
                                <span className="text-gray-600">1.</span>
                                <span className="text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-600">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Devices | Likes */}
            <div>
                <div className="bg-[#0580A5] text-white px-4 py-2 flex justify-between items-center text-lg">
                    <span>Devices</span>
                    <div className="h-4 w-[1px] bg-white/50 mx-2"></div>
                    <span>Likes</span>
                </div>
                <div className="text-sm">
                    {Array(8).fill({ name: "Xiaomi Poco X3", count: "64,853" }).map((item, idx) => (
                        <div key={idx} className={`flex justify-between items-center px-4 py-2 ${idx % 2 === 0 ? 'bg-[#67afc5]' : 'bg-white'}`}>
                            <div className="flex gap-2">
                                <span className="text-gray-600">1.</span>
                                <span className="text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-600">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SidebarStats;
