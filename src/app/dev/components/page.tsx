import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import {
  ProductCardSkeleton,
  BlogCardSkeleton,
  TextSkeleton
} from '../../../components/ui/Skeleton'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'

export default function ComponentsPage() {
  return (
    <div className="container-main py-3xl space-y-2xl">

      {/* Buttons */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Button — Variants</h2>
        <div className="flex flex-wrap gap-lg">
          <Button variant="primary">Shop Now</Button>
          <Button variant="secondary">View Collection</Button>
          <Button variant="ghost">Learn More</Button>
        </div>
      </section>

      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Button — Sizes</h2>
        <div className="flex flex-wrap items-center gap-lg">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Button — States</h2>
        <div className="flex flex-wrap gap-lg">
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Button — Full Width</h2>
        <Button variant="primary" fullWidth>
          Add to Cart
        </Button>
      </section>

      {/* Badges */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Badge — Variants</h2>
        <div className="flex flex-wrap gap-lg">
          <Badge label="New Arrival" variant="default" />
          <Badge label="Featured" variant="gold" />
          <Badge label="Heritage" variant="outline" />
        </div>
      </section>

      {/* Skeletons */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Skeleton — Product Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </section>

      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Skeleton — Blog Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </section>

      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Skeleton — Text</h2>
        <TextSkeleton lines={4} />
      </section>

      {/* Inputs */}
      <section className="space-y-lg max-w-md">
        <h2 className="text-h2 text-primary-white">Input — States</h2>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Input
          label="Full Name"
          type="text"
          placeholder="Your full name"
          hint="As it appears on your ID"
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+234 000 000 0000"
          error="Please enter a valid phone number"
        />
        <Input
          label="Disabled Field"
          type="text"
          placeholder="Cannot edit this"
          disabled
        />
        <Textarea
          label="Message"
          placeholder="Tell us about your order..."
          hint="Maximum 500 characters"
        />
      </section>

    </div>
  )
}
