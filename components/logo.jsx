import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative h-8 w-8 mr-2 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
        C
      </div>
      <span className="font-bold text-xl">Cush Migration</span>
    </Link>
  )
}
