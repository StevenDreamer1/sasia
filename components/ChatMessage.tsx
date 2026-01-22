"use client"

type Props = {
  text: string
  isSender: boolean
  time?: string
  seen?: boolean
}

export default function ChatMessage({
  text,
  isSender,
  time,
  seen,
}: Props) {
  return (
    <div
      className={`max-w-[80%] px-4 py-2 text-sm ${
        isSender
          ? "ml-auto bg-[hsl(var(--primary))] text-white"
          : "bg-white/10"
      } rounded-2xl`}
    >
      <p className="whitespace-pre-wrap">{text}</p>

      <div className="flex justify-end gap-1 mt-1 text-[10px] opacity-70">
        {time && <span>{time}</span>}
        {isSender && <span>{seen ? "✔✔" : "✔"}</span>}
      </div>
    </div>
  )
}
