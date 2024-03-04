import React, { useState } from "react"
import "./Header.css"
import { Search } from "lucide-react"

const placeHolder = "Search"
export default function Header() {
    const [search, setSearch] = useState<string>(placeHolder)
    const [touched, setTouched] = useState<boolean>(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!touched) setTouched(true)
        setSearch(e.target.value)
    }
    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
        if (e.target.value === placeHolder) setSearch("")
    }
    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (e.target.value === "") setSearch(placeHolder)
    }
    return (
        <header className="">
            <div className="relative">
                <input type="search" value={search} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                <Search size={12} className="absolute left-2 top-[7px]" />
            </div>
        </header>
    )
}