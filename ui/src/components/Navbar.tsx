import { Link } from "react-router"
import { Button } from "./ui/button"
import { HomeIcon, ModernTvIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function Navbar() {
  return (
    <nav className="mb-2 flex h-12 justify-end border-b">
      <Link to={"/viewer"}>
        <Button variant={"ghost"}>
          <HugeiconsIcon icon={ModernTvIcon} />
          Viewer
        </Button>
      </Link>
      <Link to={"/"}>
        <Button variant={"ghost"}>
          <HugeiconsIcon icon={HomeIcon} />
          Home
        </Button>
      </Link>
    </nav>
  )
}
