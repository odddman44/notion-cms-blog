"use client"

interface VideoBlockProps {
  url: string
  caption?: string
}

/** YouTube/Vimeo URL은 iframe embed, Notion 파일은 video 태그로 렌더링 */
export function VideoBlock({ url, caption }: VideoBlockProps) {
  const embedUrl = getEmbedUrl(url)

  return (
    <div className="my-4">
      {embedUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-md">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="embedded video"
          />
        </div>
      ) : (
        <video
          controls
          src={url}
          className="w-full rounded-md"
        />
      )}
      {caption && (
        <p className="mt-1.5 text-sm text-center text-muted-foreground">{caption}</p>
      )}
    </div>
  )
}

/** YouTube/Vimeo URL을 embed URL로 변환. 해당 없으면 null 반환. */
function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    // YouTube: youtube.com/watch?v=ID 또는 youtu.be/ID
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v")
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1)
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    // Vimeo: vimeo.com/ID
    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.slice(1)
      if (videoId) return `https://player.vimeo.com/video/${videoId}`
    }
  } catch {
    // URL 파싱 실패 시 null 반환
  }

  return null
}
