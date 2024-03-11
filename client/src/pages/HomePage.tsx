import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { ChevronDown, ChevronRight, Filter, MailPlus, MessageCircleMore, Plus, Rocket, SendHorizonal, UserRoundPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"

export default function HomePage() {
    const { workspaceId, channelId } = useParams()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!channelId) {
            navigate(`${pathname}/aaaaaa`)
        }
    }, [])

    return <main>
        <aside className="flex flex-col">
            <div className="flex justify-between mb-4">
                <Button variant="ghost" className="text-md mr-2"><b>boogl<ChevronDown className="inline-block mt-[-2px]" size={16} /> </b></Button>
                <div className="">
                    <Button variant="ghost" className="text-md p-2 mr-0"><b><Filter className="inline-block mt-[-2px]" size={16} /> </b></Button>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" className="text-md p-2 mr-0"><b><MailPlus className="inline-block mt-[-2px]" size={16} /> </b></Button></TooltipTrigger>
                            <TooltipContent className="">
                                <p className="">new message</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Button variant="default" className="text-sm mb-4"><Rocket className="inline-block mr-2 " size={16} />Upgrade Plan</Button>

            <Button variant="ghost" className="text-sm justify-start"><MessageCircleMore className="inline-block mr-2" size={18} />Threads</Button>
            <Button variant="ghost" className="text-sm justify-start mb-6"><SendHorizonal className="inline-block mr-2" size={18} />Drafts & sent</Button>
            <SideDropdown trigger="Channels">
                <ul>
                    <Link to={(channelId ? "../" : "") + "aaaaaa"}><li><Button variant="ghost" className="ml-1 h-7 w-full justify-start"># general</Button></li></Link>
                    <Link to={(channelId ? "../" : "") + "bbbbbb"}><li><Button variant="ghost" className="ml-1 h-7 w-full justify-start"># random</Button></li></Link>
                    <li><Button variant="ghost" className="w-full h-7 justify-start"><Plus size={14} className="mr-2" />Add channels</Button></li>
                </ul>
            </SideDropdown>
            <SideDropdown trigger="Direct messages">
                <ul>
                    <li><Button variant="ghost" className="ml-1 h-7 w-full justify-start">clogan202</Button></li>
                    <li>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="w-full h-7 justify-start"><Plus size={14} className="mr-2" />Add coworkers</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Invite people to Boogl</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={e => e.preventDefault()}>
                                    <div className="flex flex-col">
                                        <label>To:</label>
                                        <input type="email" className="w-full h-23 border border-solid rounded-md p-2" placeholder="name@example.com" />
                                        <DialogClose asChild>
                                            <div className="flex justify-end">
                                                <Button onClick={() => {
                                                    console.log("sending")
                                                }} variant="success" className="mt-3">Submit</Button>
                                            </div>
                                        </DialogClose>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </li>
                </ul>
            </SideDropdown>
            <SideDropdown trigger="Apps" defaultOpen={false}>
                <ul>
                    <li><Button variant="ghost" className="ml-1 h-7 w-full justify-start">Slackbot</Button></li>
                    <li><Button variant="ghost" className="ml-1 h-7 w-full justify-start">Pybot</Button></li>
                    <li><Button variant="ghost" className="ml-1 h-7 w-full justify-start">rtfm</Button></li>
                </ul>
            </SideDropdown>

        </aside>
        <div className="workspace text-gray-900 h-max flex flex-col">
            <div className="border-b border-solid p-3">
                <Button variant="ghost" className="text-md mr-2"><b># general <ChevronDown className="inline-block mt-[-2px]" size={16} /> </b></Button>
                <span className="text-sm font-thin text-gray-500">Comanpy-wide announcements and work-based matters</span>
                {channelId}
            </div>
            <div className="flex-1 relative overflow-auto">
                <div className="border-b border-solid p-6">
                    <h2 className="mt-10 text-2xl mb-2"><b># general</b></h2>
                    <p>You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel. (edit)</p>
                    <Button variant="outline" className="mt-4"><UserRoundPlus size={14} className="mr-2" />Add coworkers</Button>
                </div>
                <div className="message-container p-6 relative">
                    <Message avatarSrc="https://github.com/shadcn.png" avatarFallback="CN" username="clogan202" time="8:44 PM" message="You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel" />
                    <Message avatarSrc="https://github.com/shadcn.png" avatarFallback="CN" username="clogan202" time="8:44 PM" message="You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel" />
                    <Message avatarSrc="https://github.com/shadcn.png" avatarFallback="CN" username="clogan202" time="8:44 PM" message="You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel" />
                    <Message avatarSrc="https://github.com/shadcn.png" avatarFallback="CN" username="clogan202" time="8:44 PM" message="You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel" />
                    <Message avatarSrc="https://github.com/shadcn.png" avatarFallback="CN" username="clogan202" time="8:44 PM" message="You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel" />
                    <Message avatarSrc="https://github.com/shadcn.png" avatarFallback="CN" username="clogan202" time="8:44 PM" message="You created this channel on July 18th, 2017. This is the very beginning of the general channel. Description: This channel is for team-wide communication and announcements. All team members are in this channel" />
                </div>
            </div>
            <div className="flex bg-white relative">
                <textarea className="flex-grow h-36 p-2 m-4 border rounded-md border-solid" placeholder="Message #general"></textarea>
            </div>
        </div>
    </main>
}

function Message({ avatarSrc, avatarFallback, username, time, message }: { avatarSrc: string, avatarFallback: string, username: string, time: string, message: string }) {
    return <div className="flex mb-2">
        <Avatar className="mt-2 mr-2 rounded-md">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
            <h3><b>{username}</b> <span className="text-sm">{time}</span></h3>
            <p className="text-gray-800">{message}</p>
        </div>
    </div>
}

function SideDropdown({ trigger, children, defaultOpen = true }: { trigger: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col mb-2">
        <CollapsibleTrigger asChild>
            <Button variant="ghost" className="text-sm block text-left">
                {open ? <ChevronDown className="inline-block mr-2" size={16} /> : <ChevronRight className="inline-block mr-2" size={16} />}
                {trigger}</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
            {children}
        </CollapsibleContent>
    </Collapsible>
}