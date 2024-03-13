import Header from "@/components/Header/Header";
import "./Client.css";
import { Home, MessagesSquare, Bell, Bookmark, MoreHorizontal, Plus } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { ApiUser } from "../../../server/src/app";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context";

export default function Client() {
    const { user } = useContext(UserContext)

    return (
        <div className="client">
            <Header />
            <Login user={user} />
            <div className="content">
                <Rail />
                <Outlet />
            </div>
        </div>
    )
}

function Login({ user }: { user: ApiUser | null }) {
    return <Dialog open={!user} onOpenChange={() => { }} >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Please sign in</DialogTitle>
                <DialogDescription>
                    Please sign in to continue to your workspace
                </DialogDescription>
                <Button className="">Sign in with GitHub</Button>
                <Separator />
                <Button variant="outline">Sign in with Anon account</Button>
            </DialogHeader>
        </DialogContent>
    </Dialog>
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