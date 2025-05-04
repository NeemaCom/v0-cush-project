import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <span className="text-primary text-2xl font-bold">Cush</span>
    </Link>
  )
}
