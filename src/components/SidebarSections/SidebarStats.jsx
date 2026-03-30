import { useSidebarLikeStats } from "../../hooks/useSidebarLikeStats";
import { useSidebarVisitorStats } from "../../hooks/useSidebarVisitorStats";

const StatsSection = ({ label, items, loading, error, emptyMessage }) => (
  <div>
    <div className="bg-[#0580A5] text-white px-4 py-2 mb-2 flex justify-between items-center text-lg">
      <span>Devices</span>
      <div className="h-4 w-[1px] bg-white/50 mx-2"></div>
      <span>{label}</span>
    </div>

    <div className="text-sm">
      {loading ? (
        <div className="bg-white px-4 py-4 text-gray-600">Loading...</div>
      ) : error ? (
        <div className="bg-white px-4 py-4 text-red-700">{error}</div>
      ) : items.length === 0 ? (
        <div className="bg-white px-4 py-4 text-gray-600">{emptyMessage}</div>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id ?? index}
            className={`flex justify-between items-center px-4 py-2 ${
              index % 2 === 0 ? "bg-[#67afc5]" : "bg-white"
            }`}
          >
            <div className="flex gap-2">
              <span className="text-gray-600">{index + 1}.</span>
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <span className="text-gray-600">{item.count}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

const SidebarStats = () => {
  const { visitorDevices, status: visitorStatus } = useSidebarVisitorStats();
  const { likedDevices, status } = useSidebarLikeStats();

  return (
    <div className="flex flex-col gap-6">
      <StatsSection
        label="Visitors"
        items={visitorDevices.map((device) => ({
          id: device.id,
          name: device.name,
          count: device.visitedCount.toLocaleString(),
        }))}
        loading={visitorStatus.loading}
        error={visitorStatus.error}
        emptyMessage="No visitor data available."
      />

      <StatsSection
        label="Likes"
        items={likedDevices.map((device) => ({
          id: device.id,
          name: device.name,
          count: device.likesCount.toLocaleString(),
        }))}
        loading={status.loading}
        error={status.error}
        emptyMessage="No device likes available."
      />
    </div>
  );
};

export default SidebarStats;
