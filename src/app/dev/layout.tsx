import Link from 'next/link'

export default function DevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-primary-black">
      <nav className="container-main py-md flex gap-lg border-b 
                      border-secondary-grey">
        <Link
          href="/dev/typography"
          className="text-small text-secondary-grey hover:text-accent-gold 
                     transition-colors duration-150"
        >
          Typography
        </Link>
        <Link
          href="/dev/palette"
          className="text-small text-secondary-grey hover:text-accent-gold 
                     transition-colors duration-150"
        >
          Palette
        </Link>
        <Link
          href="/dev/navbar"
          className="text-small text-secondary-grey hover:text-accent-gold 
                     transition-colors duration-150"
        >
          Navbar
        </Link>
        <Link
          href="/dev/layout-test"
          className="text-small text-secondary-grey hover:text-accent-gold 
                     transition-colors duration-150"
        >
          Layout
        </Link>
        <Link
          href="/dev/components"
          className="text-small text-secondary-grey hover:text-accent-gold 
                     transition-colors duration-150"
        >
          Components
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}