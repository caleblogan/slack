import Header from "@/components/Header/Header";
import "./Client.css";
import { Home, MessagesSquare, Bell, Bookmark, MoreHorizontal, Plus } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
            <WorkspaceLink name="B" />
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

function WorkspaceLink({ name }: { name: string }) {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className={`text-xl mb-3 bg-gray-500 hover:bg-opacity-35 rounded-md w-[36px] h-[36px]`}>
                {name}
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-2 min-w-[300px]">
            <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                <h3>Boogl</h3>
                <p className="text-gray-600">juggle-hq.slack.com</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-md text-gray-500 cursor-pointer">
                <Plus size={24} className="mr-4" /> Add a workspace
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}