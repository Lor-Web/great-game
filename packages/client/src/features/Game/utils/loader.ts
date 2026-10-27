import type { SpriteId } from '../enums'
import { type GameImages, spriteFiles } from './manifest'

const imageCache = new Map<string, Promise<HTMLImageElement>>()

const loadImage = (url: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(url)
  if (cached) return cached

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      image.onload = null
      image.onerror = null
      resolve(image)
    }
    image.onerror = () => {
      image.onload = null
      image.onerror = null
      // Ошибку не кешируем: следующий вход на страницу сможет повторить загрузку.
      imageCache.delete(url)
      reject(new Error(`Не удалось загрузить спрайт: ${url}`))
    }
    image.src = url
  })

  imageCache.set(url, promise)
  return promise
}

export const loadGameImages = async (): Promise<GameImages> => {
  const entries = Object.entries(spriteFiles) as [SpriteId, string][]
  const images = await Promise.all(
    entries.map(async ([id, file]) => {
      const url = `${import.meta.env.BASE_URL}game-assets/sprites/${file}`
      const image = await loadImage(url)
      return [id, image] as const
    })
  )

  return Object.fromEntries(images) as GameImages
}
