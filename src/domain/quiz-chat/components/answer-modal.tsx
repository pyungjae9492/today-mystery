"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface AnswerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answer: string
  onConfirmAnswer: () => void
  isCompleted?: boolean
}

export function AnswerModal({ 
  open, 
  onOpenChange, 
  answer, 
  onConfirmAnswer,
  isCompleted = false
}: AnswerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500" />
            정답 확인
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800"
          >
            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
              {answer}
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-2">
            {!isCompleted ? (
              <Button
                onClick={onConfirmAnswer}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                정답 확인 완료
              </Button>
            ) : (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 text-center">
                  🎉 이미 퀴즈를 완료했습니다!
                </p>
              </div>
            )}
            
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 