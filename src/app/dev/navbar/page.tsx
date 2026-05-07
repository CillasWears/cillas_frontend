export default function NavbarTestPage() {
  return (
    <div className="min-h-screen bg-primary-black">
      {/* Tall content to test scroll behaviour */}
      <div className="container-main pt-3xl space-y-3xl">
        <div className="h-screen flex items-center justify-center">
          <p className="text-h2 text-primary-white">
            Scroll down to test navbar scroll behaviour
          </p>
        </div>
        <div className="h-screen flex items-center justify-center">
          <p className="text-body text-secondary-grey">
            Navbar should now be solid black with a subtle border
          </p>
        </div>
      </div>
    </div>
  )
}