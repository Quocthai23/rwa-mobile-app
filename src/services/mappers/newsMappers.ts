/**
 * News Data Mappers
 * Transform raw API responses to normalized NewsItem format
 */

import dayjs from 'dayjs'

import type { NewsItem } from '@/types'

/**
 * App2 API returns snake_case format. Map to mobile-app camelCase NewsItem.
 */
export function mapApp2NewsItem(item: {
  content?: string
  created_at?: string
  excerpt?: string
  id?: string
  is_featured?: boolean
  published_at?: string
  read_time_minutes?: number
  slug?: string
  source?: string
  thumbnail_url?: string | null
  title?: string
  updated_at?: string
  url?: string | null
  language?: string
  category_id?: string
}): NewsItem {
  const publishedAt = item.published_at ?? new Date().toISOString()
  const createdAt = item.created_at ?? publishedAt
  const updatedAt = item.updated_at ?? publishedAt

  return {
    categoryId: item.category_id ?? 'finance',
    content: item.content ?? '',
    createdAt,
    excerpt: item.excerpt ?? '',
    id: item.id ?? `news-${Date.now()}`,
    isFeatured: item.is_featured ?? false,
    language: item.language ?? 'en',
    publishedAt,
    readTimeMinutes: item.read_time_minutes ?? 1,
    slug: item.slug ?? '',
    source: item.source ?? 'Unknown',
    thumbnailUrl: item.thumbnail_url ?? null,
    title: item.title ?? 'No title',
    updatedAt,
    url: item.url ?? null,
  }
}

import type {
  BloombergRawItem,
  ReutersRawItem,
  TradingEconomicsRawItem,
  VnWallStreetRawItem,
} from '@/types'

const DEFAULT_CATEGORY = 'finance'
const WORDS_PER_MINUTE = 200

export function mapBloombergItem(
  item: BloombergRawItem,
  index: number,
): NewsItem {
  const itemId = item.id ?? item.storyId ?? `${Date.now()}`
  const publishedDate = dayjs(
    item.publishedAt ?? item.publishedTime ?? item.date ?? new Date(),
  )

  const title = item.title ?? item.headline ?? item.name ?? 'No title'
  const description =
    item.description ?? item.summary ?? item.abstract ?? item.excerpt ?? title
  const image =
    item.image ?? item.thumbnail ?? item.heroImage ?? item.coverImage ?? null
  const url = item.url ?? item.link ?? item.canonicalUrl ?? null

  return {
    categoryId: DEFAULT_CATEGORY,
    content: description,
    createdAt: publishedDate.toISOString(),
    excerpt: description,
    id: `bloomberg-${itemId}-${index}`,
    isFeatured: item.featured ?? item.promoted ?? false,
    language: 'en',
    publishedAt: publishedDate.toISOString(),
    readTimeMinutes: calculateReadTime(description),
    slug: generateSlug(title, `article-${index}`),
    source: 'Bloomberg',
    thumbnailUrl: extractImageUrl(image),
    title,
    updatedAt: publishedDate.toISOString(),
    url,
  }
}

export function mapReutersItem(item: ReutersRawItem, index: number): NewsItem {
  const itemId = item._id ?? item.id ?? `${Date.now()}`
  const publishedDate = dayjs(
    item.published_time ?? item.display_date ?? item.last_updated ?? new Date(),
  )

  const title =
    item.headlines?.basic ??
    item.headlines?.default ??
    item.title ??
    item.headline ??
    'No title'
  const description =
    item.description?.basic ??
    item.description?.default ??
    item.summary ??
    item.abstract ??
    title

  let image: null | string = null
  if (item.promo_items?.basic?.url) {
    image = item.promo_items.basic.url
  } else if (item.promo_items?.lead_art?.url) {
    image = item.promo_items.lead_art.url
  } else if (item.related_images?.[0]?.url) {
    image = item.related_images[0].url
  } else if (item.thumbnail?.url) {
    image = item.thumbnail.url
  }

  const url =
    item.canonical_url ?? item.website_url ?? item.url ?? item.link ?? null

  return {
    categoryId: DEFAULT_CATEGORY,
    content: description,
    createdAt: publishedDate.toISOString(),
    excerpt: description,
    id: `reuters-${itemId}-${index}`,
    isFeatured: item.promoted ?? false,
    language: 'en',
    publishedAt: publishedDate.toISOString(),
    readTimeMinutes: calculateReadTime(description),
    slug: generateSlug(title, `article-${index}`),
    source: 'Reuters',
    thumbnailUrl: image,
    title,
    updatedAt: publishedDate.toISOString(),
    url,
  }
}

export function mapTradingEconomicsItem(
  item: TradingEconomicsRawItem,
  index: number,
): NewsItem {
  const itemId = item.ID ?? item.Id ?? item.id ?? Date.now()
  const publishedDate = item.date ? dayjs(item.date) : dayjs()
  const description = item.description ?? item.title ?? ''

  let fullUrl = item.url ?? item.Url ?? null
  if (fullUrl?.startsWith('/')) {
    fullUrl = `https://tradingeconomics.com${fullUrl}`
  }

  return {
    author: item.author,
    categoryId: item.category ?? DEFAULT_CATEGORY,
    content: description,
    country: item.country,
    createdAt: publishedDate.toISOString(),
    excerpt: description,
    id: `te-${itemId}-${index}`,
    isFeatured: item.importance === 1 || item.importance === '1',
    language: 'en',
    publishedAt: publishedDate.toISOString(),
    readTimeMinutes: calculateReadTime(description),
    slug: generateSlug(item.title ?? '', `article-${index}`),
    source: 'TradingEconomics',
    thumbnailUrl: item.image ?? item.thumbnail ?? null,
    title: item.title ?? 'No title',
    updatedAt: publishedDate.toISOString(),
    url: fullUrl,
  }
}

export function mapVnWallStreetItem(item: VnWallStreetRawItem): NewsItem {
  const publishedDate = dayjs(
    typeof item.createtime === 'number' ? item.createtime : item.createtime,
  )

  return {
    categoryId: DEFAULT_CATEGORY,
    content: item.content,
    createdAt: publishedDate.toISOString(),
    excerpt: item.content,
    id: `vn-${String(item.messageid)}`,
    isFeatured: item.important === '1',
    language: 'vi',
    publishedAt: publishedDate.toISOString(),
    readTimeMinutes: 1,
    slug: String(item.messageid),
    source: 'VnWallStreet',
    thumbnailUrl: item.img ?? null,
    title: item.content,
    updatedAt: publishedDate.toISOString(),
    url: null,
  }
}

function calculateReadTime(text: string): number {
  const wordCount = text.split(/\s+/).length

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}

function extractImageUrl(
  image: BloombergRawItem['image'] | null,
): null | string {
  if (!image) return null
  if (typeof image === 'string') return image

  return image.url ?? image.src ?? null
}

function generateSlug(title: string, fallback: string): string {
  if (!title) return fallback

  return title
    .toLowerCase()
    .replaceAll(/[^\da-z]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')
}
