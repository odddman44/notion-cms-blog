interface BookmarkBlockProps {
  url: string
  caption?: string
}

/** bookmark/embed 블록 — favicon + URL 카드 링크 */
export function BookmarkBlock({ url, caption }: BookmarkBlockProps) {
  let hostname = ""
  try {
    hostname = new URL(url).hostname
  } catch {
    hostname = url
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`

  return (
    <div className="my-3">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 border border-border rounded-lg p-3 hover:bg-muted transition-colors no-underline"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl}
          alt={`${hostname} favicon`}
          width={16}
          height={16}
          className="rounded-sm shrink-0"
        />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate text-foreground">{hostname}</p>
          <p className="text-xs text-muted-foreground truncate">{url}</p>
        </div>
      </a>
      {caption && (
        <p className="mt-1.5 text-sm text-center text-muted-foreground">{caption}</p>
      )}
    </div>
  )
}
