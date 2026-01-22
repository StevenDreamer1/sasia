"use client"

type Props = {
  file: File
}

export default function FilePreview({ file }: Props) {
  const url = URL.createObjectURL(file)

  if (file.type.startsWith("image/")) {
    return (
      <img
        src={url}
        className="max-w-xs rounded-lg border border-white/10"
      />
    )
  }

  if (file.type.startsWith("video/")) {
    return (
      <video
        src={url}
        controls
        className="max-w-xs rounded-lg"
      />
    )
  }

  return (
    <div className="px-3 py-2 bg-white/10 rounded text-sm">
      📄 {file.name}
    </div>
  )
}
