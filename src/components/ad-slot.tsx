"use client"

import { useEffect, useId } from "react"

type Size = [number, number]

export type AdSlotProps = {
  unitPath: string
  sizes: Size[]
  mapping?: Array<{ viewport: [number, number]; sizes: Size[] }>
  className?: string
}

export default function AdSlot({ unitPath, sizes, mapping, className }: AdSlotProps) {
  const slotId = useId().replace(/:/g, "-")

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_ADS !== "true") return
    // @ts-expect-error GPT global injected via script in layout
    const googletag = window.googletag || (window.googletag = { cmd: [] })

    googletag.cmd.push(function () {
      let define = googletag.defineSlot(unitPath, sizes, slotId)
      if (!define) return
      define = define.addService(googletag.pubads())

      if (Array.isArray(mapping) && mapping.length > 0) {
        const sizeMapping = googletag.sizeMapping()
        mapping.forEach(m => sizeMapping.addSize(m.viewport, m.sizes))
        define.defineSizeMapping(sizeMapping.build())
      }

      googletag.display(slotId)
    })
  }, [slotId, unitPath, JSON.stringify(sizes), JSON.stringify(mapping)])

  if (process.env.NEXT_PUBLIC_ENABLE_ADS !== "true") {
    return null
  }

  return (
    <div className={className}>
      <div id={slotId} />
    </div>
  )
} 