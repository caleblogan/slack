import Header from "@/components/Header/Header";
import "./Client.css";
import { Home, MessagesSquare, Bell, Bookmark, MoreHorizontal } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function Client() {
    return (
        <div className="client">
            <Header />
            <div className="content">
                <Rail />
                <Outlet />
            </div>
        </div>
    )
}


function Rail() {
    return <div className="rail">
        <div className="flex flex-col">
            <RailLink to="" icon={<Home size={20} className="block m-auto" />} name="Home" end />
            <RailLink to="dms" icon={<MessagesSquare size={20} className="block m-auto" />} name="DMs" />
            <RailLink to="activity" icon={<Bell size={20} className="block m-auto" />} name="Activity" />
            <RailLink to="later" icon={<Bookmark size={20} className="block m-auto" />} name="Later" />
            <div className="mb-4">
                <button className={`hover:bg-gray-400 hover:bg-opacity-35 rounded-md w-[36px] h-[36px]`}>
                    <MoreHorizontal size={20} className="block m-auto" style={{}} />
                </button>
                <div className="text-[11px] font-thin text-center">More</div>
            </div>
        </div>
    </div>
}

function RailLink({ to, icon, name, end }: { to: string, icon: React.JSX.Element, name: string, end?: boolean }) {
    return <div className="mb-4">
        <NavLink to={to} end={end}>
            {({ isActive }) => (
                <>
                    <button className={`hover:bg-gray-400 hover:bg-opacity-35 rounded-md w-[36px] h-[36px] ${isActive && ("bg-opacity-35 bg-gray-400")}`}>
                        {icon}
                    </button>
                    <div className="text-[11px] font-thin text-center">{name}</div>
                </>
            )}
        </NavLink>
    </div>
}