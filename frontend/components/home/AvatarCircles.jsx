"use client"

export default function AvatarCircles({ numPeople = 0, avatarUrls = [], size = 32, overlap = 8 }) {
  const displayed = avatarUrls.slice(0, 4)
  const extra = Math.max(0, numPeople - displayed.length)

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3 items-center">
        {displayed.map((a, i) => (
          <a key={i} href={a.profileUrl || '#'} target="_blank" rel="noreferrer" className="block rounded-full overflow-hidden bg-[var(--color-card)]/90 border border-[var(--color-border)]" style={{ width: size, height: size }}>
            <img src={a.imageUrl} alt={`avatar-${i}`} className="w-full h-full object-cover" />
          </a>
        ))}
        {extra > 0 && (
          <div className="flex items-center justify-center rounded-full bg-[var(--color-card)]/90 border border-[var(--color-border)] text-xs font-medium text-[var(--color-foreground)]" style={{ width: size, height: size }}>
            +{extra}
          </div>
        )}
      </div>
    </div>
  )
}
