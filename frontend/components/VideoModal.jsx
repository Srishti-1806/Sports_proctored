"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function VideoModal({ isOpen, onClose, video = {} }) {
  const { title = '', description = '', url = '' } = video

  const isYouTube = typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be'))

  const getYouTubeEmbed = (u) => {
    try {
      const urlObj = new URL(u)
      let id = ''
      if (urlObj.hostname.includes('youtu.be')) {
        id = urlObj.pathname.slice(1)
      } else {
        id = urlObj.searchParams.get('v') || ''
      }
      return id ? `https://www.youtube.com/embed/${id}` : u
    } catch (e) {
      return u
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-popover transition-colors z-10">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="w-full bg-black/80">
              {isYouTube ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={getYouTubeEmbed(url)}
                    title={title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video className="w-full h-auto max-h-[70vh]" controls>
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="p-6 max-h-[40vh] overflow-y-auto">
              <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
