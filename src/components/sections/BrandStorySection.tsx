import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';
import Container from '../layout/Container';

export default function BrandStorySection() {
  return (
    <section
      className="py-3xl bg-primary-black"
      aria-labelledby="brand-story-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl
                        items-center">

          {/* Image Side */}
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/brand-story.png"
              alt="Cilla's Wear — The Story Behind the Brand"
              fill
              quality={75}
              className="object-cover object-center transition-transform
                         duration-300 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text Side */}
          <div className="space-y-xl">
            {/* Eyebrow */}
            <p className="text-label text-accent-gold">Our Story</p>

            {/* Heading */}
            <h2
              id="brand-story-heading"
              className="text-h2 text-primary-white font-primary"
            >
              Rooted in Culture,
              <br />
              Designed for Today
            </h2>

            {/* Body */}
            <div className="space-y-lg">
              <p className="text-body text-secondary-grey">
                Cilla's Wear was born from a deep reverence for African
                heritage and a desire to translate that richness into
                contemporary fashion. Every collection draws from the
                vibrant tapestry of African culture — its patterns,
                its textures, its stories.
              </p>
              <p className="text-body text-secondary-grey">
                We believe that fashion is more than clothing. It is
                identity, expression, and legacy. Our pieces are crafted
                to be worn with pride — bold enough to make a statement,
                refined enough to stand the test of time.
              </p>
            </div>

            {/* Divider */}
            <div
              className="w-16 h-px bg-accent-gold"
              aria-hidden="true"
            />

            {/* CTA */}
            <Link href="/blog">
              <Button variant="ghost">
                Read Our Stories →
              </Button>
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
}
