import DashboardSidebar from './DashboardSidebar';

const DashboardPageLayout = ({ children }) => {
    return (
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-1 pb-6 sm:px-2 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-4 lg:px-4">
            <DashboardSidebar />
            <div className="min-w-0 border-b-[8px] border-[#0580A5] pb-6">
                {children}
            </div>
        </div>
    );
};

export default DashboardPageLayout;
