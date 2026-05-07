interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  // Split plain text into paragraphs by double newlines
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div
      className="space-y-lg"
      aria-label="Blog post content"
    >
      {paragraphs.map((paragraph, index) => {
        // Check if paragraph looks like a heading (short, no period)
        const isHeading =
          paragraph.length < 80 && !paragraph.endsWith('.')

        if (isHeading && index > 0) {
          return (
            <h2
              key={index}
              className="text-h3 text-primary-white font-primary 
                         pt-lg"
            >
              {paragraph}
            </h2>
          )
        }

        return (
          <p
            key={index}
            className="text-body text-secondary-grey leading-relaxed"
          >
            {paragraph}
          </p>
        )
      })}
    </div>
  )
}
