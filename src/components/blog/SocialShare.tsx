'use client'

import { Facebook, Twitter, Link2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SocialShareProps {
  title: string
  slug: string
}

export default function SocialShare({ title, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState(`/blog/${slug}`)

  useEffect(() => {
    setUrl(`${window.location.origin}/blog/${slug}`)
  }, [slug])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
  ]

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div
      className="flex items-center gap-md"
      aria-label="Share this post"
    >
      <p className="text-label text-secondary-grey">Share</p>

      {shareLinks.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-secondary-grey hover:text-accent-gold 
                       transition-colors duration-150
                       focus-visible:outline-none 
                       focus-visible:text-accent-gold"
          >
            <Icon size={18} strokeWidth={1.5} />
          </a>
        )
      })}

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        aria-label={copied ? 'Link copied!' : 'Copy link'}
        className="text-secondary-grey hover:text-accent-gold 
                   transition-colors duration-150
                   focus-visible:outline-none 
                   focus-visible:text-accent-gold"
      >
        <Link2 size={18} strokeWidth={1.5} />
      </button>

      {copied && (
        <span
          role="status"
          className="text-small text-accent-gold"
          aria-live="polite"
        >
          Copied!
        </span>
      )}
    </div>
  )
}
