import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-screen min-h-[600px] flex items-center
                 justify-center overflow-hidden"
      aria-label="Hero — Cilla's Wear"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Cilla's Wear — Premium Urban-African Fashion"
          fill
          priority
          quality={90}
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Dark overlay for text legibility */}
        <div
          className="absolute inset-0 bg-primary-black/60"
          aria-hidden="true"
        />
      </div>

      {/* Hero Content */}
      <div
        className="relative z-10 text-center px-md max-w-3xl mx-auto
                   space-y-xl"
      >
        {/* Eyebrow */}
        <p className="text-label text-accent-gold tracking-wider">
          Premium Urban-African Fashion
        </p>

        {/* Heading */}
        <h1 className="text-h1 text-primary-white font-primary">
          Wear Your
          <br />
          <span className="text-accent-gold">Heritage</span>
        </h1>

        {/* Subheading */}
        <p className="text-body text-primary-white/80 max-w-xl mx-auto">
          Bold, minimal, and deeply cultural clothing crafted for the
          modern African. Each piece tells a story rooted in tradition
          and contemporary design.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center
                        justify-center gap-lg">
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Shop Collection
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="secondary" size="lg">
              Our Stories
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-xl left-1/2 -translate-x-1/2 z-10
                   flex flex-col items-center gap-sm"
        aria-hidden="true"
      >
        <span className="text-label text-primary-white/50">Scroll</span>
        <div
          className="w-px h-12 bg-gradient-to-b from-primary-white/50
                     to-transparent animate-pulse"
        />
      </div>
    </section>
  );
}
