"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
}

const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    setPieces(newPieces)

    const timer = setTimeout(() => {
      setPieces([])
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: piece.x,
            top: piece.y,
            width: 8,
            height: 8,
            backgroundColor: piece.color,
            borderRadius: "50%",
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            x: piece.x + (Math.random() - 0.5) * 200,
            rotate: piece.rotation + 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  )
} 