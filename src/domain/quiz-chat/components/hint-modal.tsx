"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lightbulb, Lock, Unlock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HintModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hints: string[]
  unlockedHints: number
  onUnlockHint: () => void
  isCompleted?: boolean
}

export function HintModal({ 
  open, 
  onOpenChange, 
  hints, 
  unlockedHints, 
  onUnlockHint,
  isCompleted = false
}: HintModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            힌트
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hints.map((hint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                index < unlockedHints 
                  ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" 
                  : "bg-neutral-50 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
              }`}
            >
              <div className="flex items-start gap-3">
                {index < unlockedHints ? (
                  <Unlock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  {index < unlockedHints ? (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {hint}
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      힌트 {index + 1}을 해금하세요
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {unlockedHints < hints.length && !isCompleted && (
            <Button
              onClick={onUnlockHint}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              disabled={unlockedHints >= hints.length}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              힌트 {unlockedHints + 1} 해금하기
            </Button>
          )}
          
          {isCompleted && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                🎉 퀴즈를 완료했습니다!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 