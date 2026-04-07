import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import "../css/adminAnalytics.css"
import { CalendarPlus2, BadgeCheck, UserCheck, ClockAlert, CalendarSync } from 'lucide-react';

function Analytics() {
    const analyticsItems = [
        {label: "Total Number of Events", statistic: 2, icon: CalendarPlus2},
        {label: "Total Event Attendance", statistic: 3, icon: BadgeCheck},
        {label: "Total Registered Users", statistic: 4, icon: UserCheck},
        {label: "Total Upcoming Events", statistic: 5, icon: ClockAlert},
        {label: "Total Past Events", statistic: 6, icon: CalendarSync},
    ];


    return (
        <div className="homepage-layout">
            <AdminSidebar />
            <div className="main-content">
                <TopNav />
                <h1 className="page-title">Analytics Dashboard</h1>
                <h3 className="section-header">Overview</h3>
                <div className="analytics-container">
                    <div className="analytics-main-cards">{analyticsItems.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon} />
                    ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Analytics;

function AnalyticsCard( {label, statistic, icon: Icon } ) {
    return (
        <div className="main-cards-details">
            <Icon className="details-icon" />
            <h1 className="details-statistic">{statistic}</h1>
            <p className="details-name">{label}</p>
        </div>
    )
}