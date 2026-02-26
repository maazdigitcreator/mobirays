import React from 'react';

const SidebarLatestModels = () => {
    return (
        <div>
            <div className="bg-[#0580A5] text-white px-4 py-2 flex justify-between items-center text-lg">
                <span>Latest Mobile Phone Models</span>
            </div>
            <div className="text-sm">
                {Array(8).fill({ name: "Xiaomi Poco X3", count: "64,853" }).map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center px-4 py-2 ${idx % 2 === 0 ? 'bg-[#67afc5]' : 'bg-white'}`}>
                        <div className="flex gap-2">
                            <span className="text-gray-600">1.</span>
                            <span className="text-gray-700 font-medium">{item.name}</span>
                        </div>
                        {/* <span className="text-gray-600">{item.count}</span> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SidebarLatestModels;
