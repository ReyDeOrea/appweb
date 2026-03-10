"use client"

import { supabase } from "@/lib/supabase/supabase"
import { useEffect, useState } from "react"

interface Props {
  size?: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function AvatarView({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path)

      if (error) throw error

      const reader = new FileReader()
      reader.readAsDataURL(data)

      reader.onload = () => {
        setAvatarUrl(reader.result as string)
      }
    } catch (error: any) {
      console.log("Error downloading image:", error.message)
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      const arrayBuffer = await file.arrayBuffer()

      const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "jpeg"
      const path = `${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(path, arrayBuffer, {
          contentType: file.type ?? "image/jpeg",
        })

      if (error) throw error

      onUpload(data.path)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      
      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{ width: size, height: size }}
          className="rounded-full object-cover border"
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="rounded-full bg-gray-700 border"
        />
      )}

      {/* Upload */}
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />

        <span className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {uploading ? "Uploading..." : "Upload"}
        </span>
      </label>

    </div>
  )
}