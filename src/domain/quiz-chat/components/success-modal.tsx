"use client"

import { motion } from "framer-motion"
import * as Dialog from "@radix-ui/react-dialog"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answer: string
  onComplete?: () => void
}

export function SuccessModal({ open, onOpenChange, answer, onComplete }: SuccessModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 -translate-y-1/2 rounded-xl border border-green-500/20 bg-neutral-950 p-6 shadow-2xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center"
            >
              <span className="text-2xl">🎉</span>
            </motion.div>
            
            <Dialog.Title className="text-xl font-bold text-white mb-2">
              정답입니다! 🎊
            </Dialog.Title>
            
            <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
              축하합니다! 퀴즈를 성공적으로 해결하셨네요.
            </p>
            
            <div className="bg-neutral-900 rounded-lg p-3 mb-6">
              <p className="text-sm text-neutral-400 mb-1">정답</p>
              <p className="text-green-400 font-medium">{answer}</p>
            </div>
            
            <div className="flex justify-center">
              <Dialog.Close asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-2.5 text-sm font-medium text-black hover:from-green-400 hover:to-green-500 transition-all"
                >
                  확인
                </motion.button>
              </Dialog.Close>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 