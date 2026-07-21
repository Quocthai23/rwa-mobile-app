#!/usr/bin/env node
/**
 * Test Calendar + News APIs - same URLs mobile-app uses
 * Run: node scripts/test-apis.mjs
 */

const CALENDAR_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json'
const VNWALLSTREET_URL =
  'https://vnwallstreet.top/api/inter/newsFlash/page?limit=5&start=0&uid=-1&time_=1767113855632&sign_=F96851E4343F3ACCE702D28EBEEDB756'
const TE_URL =
  'https://tradingeconomics.com/ws/stream.ashx?start=0&size=5&i=economy'
const BLOOMBERG_URL =
  'https://www.bloomberg.com/lineup-next/api/stories?types=ARTICLE&locale=en&pageNumber=1&limit=3'
const REUTERS_QUERY = encodeURIComponent(
  JSON.stringify({
    'arc-site': 'reuters',
    fetch_type: 'collection',
    offset: 0,
    requestId: 1,
    section_id: '/world/',
    size: '5',
    uri: '/world/',
    website: 'reuters',
  }),
)
const REUTERS_URL = `https://www.reuters.com/pf/api/v3/content/fetch/articles-by-section-alias-or-id-v1?query=${REUTERS_QUERY}&d=341&mxId=00000000&_website=reuters`

async function fetchJson(url, label) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Test/1.0)',
        Accept: 'application/json',
      },
    })
    const data = await res.json()
    console.log(`\n✅ ${label} - OK (${res.status})`)
    return { ok: true, data, status: res.status }
  } catch (err) {
    console.log(`\n❌ ${label} - FAIL:`, err.message)
    return { ok: false, error: err.message }
  }
}

async function main() {
  console.log('=== Testing Mobile App API Sources ===\n')

  // 1. Economic Calendar
  const calendar = await fetchJson(CALENDAR_URL, 'ForexFactory Calendar')
  if (calendar.ok && Array.isArray(calendar.data)) {
    const today = new Date().toISOString().split('T')[0]
    const forToday = calendar.data.filter((e) => e.date?.startsWith(today))
    console.log(`   Events today (${today}): ${forToday.length}`)
    if (forToday[0]) {
      console.log(`   Sample: ${forToday[0].title} @ ${forToday[0].time || forToday[0].date}`)
    }
  }

  // 2. VnWallStreet News
  const vn = await fetchJson(VNWALLSTREET_URL, 'VnWallStreet News')
  if (vn.ok && vn.data?.data) {
    console.log(`   Items: ${vn.data.data.length}, total: ${vn.data.allCount}`)
    const first = vn.data.data[0]
    if (first) {
      console.log(`   Sample: ${(first.content || '').slice(0, 50)}...`)
    }
  }

  // 3. TradingEconomics
  const te = await fetchJson(TE_URL, 'TradingEconomics News')
  if (te.ok) {
    const arr = Array.isArray(te.data) ? te.data : te.data?.data ?? []
    console.log(`   Items: ${arr.length}`)
    if (arr[0]) {
      console.log(`   Sample: ${(arr[0].title || '').slice(0, 50)}...`)
    }
  }

  // 4. Bloomberg
  const bl = await fetchJson(BLOOMBERG_URL, 'Bloomberg News')
  if (bl.ok && bl.data) {
    const stories = bl.data.stories ?? bl.data.data ?? bl.data.items ?? []
    console.log(`   Items: ${stories.length}`)
    if (stories[0]) {
      console.log(`   Sample: ${(stories[0].title || stories[0].headline || '').slice(0, 50)}...`)
    }
  } else if (!bl.ok) {
    console.log(`   (403/blocked is common - use VnWallStreet/TE for mobile)`)
  }

  // 5. Reuters
  const re = await fetchJson(REUTERS_URL, 'Reuters News')
  if (re.ok && re.data) {
    const arr = re.data.content_elements ?? re.data.articles ?? []
    console.log(`   Items: ${arr.length}`)
    if (arr[0]) {
      const t = arr[0].headlines?.basic ?? arr[0].title ?? ''
      console.log(`   Sample: ${String(t).slice(0, 50)}...`)
    }
  } else if (!re.ok) {
    console.log(`   (May be blocked - use VnWallStreet/TE)`)
  }

  // 6. Simulate mobile-app transform (calendar)
  if (calendar.ok && Array.isArray(calendar.data)) {
    const today = new Date().toISOString().split('T')[0]
    const filtered = calendar.data.filter((e) => e.date?.startsWith(today))
    console.log('\n📱 Mobile transform check (Calendar):')
    console.log(`   Input: ${filtered.length} FF items for ${today}`)
    if (filtered.length > 0) {
      const e = filtered[0]
      const time = (() => {
        try {
          const d = new Date(e.date)
          const h = d.getHours()
          const m = d.getMinutes()
          return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
        } catch {
          return '--:--'
        }
      })()
      console.log(`   Output sample: { event: "${e.title?.slice(0, 30)}...", time: "${time}", impact: "${e.impact}" }`)
    }
  }

  // 7. Simulate mobile-app transform (news)
  if (vn.ok && vn.data?.data?.[0]) {
    const item = vn.data.data[0]
    const pubAt = item.createtime
      ? new Date(typeof item.createtime === 'number' ? item.createtime : item.createtime).toISOString()
      : null
    console.log('\n📱 Mobile transform check (News):')
    console.log(`   VnWallStreet → NewsItem: id=vn-${item.messageid}, title="${(item.content || '').slice(0, 40)}...", publishedAt=${pubAt ? 'OK' : 'MISSING'}`)
  }

  console.log('\n=== Done ===')
}

main()
