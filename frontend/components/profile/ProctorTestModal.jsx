"use client"

import { X, Download, Play, AlertCircle, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProctorTestModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log('Download test application')
    alert('Test application download will start soon!')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed top-0 left-0 w-full h-full inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden w-[60dvw] h-[90dvh]"
            >
              {/* Header */}
              <div className="relative bg-linear-to-br from-[#3D52A0] to-[#7091E6] p-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Proctored Skills Assessment
                    </h2>
                    <p className="text-[#ADBBDA] text-sm sm:text-base">
                      Take your performance evaluation to the next level
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[80dvh]">
                {/* Video Demo Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-3 flex items-center gap-2">
                    Watch Demo
                  </h3>
                  <div className="relative aspect-video bg-linear-to-br from-[#EDE8F5] to-[#ADBBDA]/20 rounded-2xl overflow-hidden border-2 border-[#EDE8F5] group cursor-pointer hover:border-[#7091E6] transition-colors">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[#3D52A0] ml-0.5" />
                      </div>
                      <p className="mt-4 text-[#8697C4] font-medium">Click to play demo video</p>
                    </div>
                    {/* Placeholder for actual video embed */}
                    <video className="w-full h-full object-cover hidden" controls>
                      <source src="/demo-video.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>


                {/* Requirements */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1 text-sm">Requirements</h4>
                      <ul className="text-xs text-amber-800 space-y-1">
                        <li>• Webcam access required</li>
                        <li>• Stable internet connection (minimum 5 Mbps)</li>
                        <li>• Desktop application must be installed</li>
                        <li>• Ensure proper lighting</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border-2 border-[#ADBBDA] text-[#8697C4] rounded-xl font-semibold hover:bg-[#EDE8F5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-4 py-2 bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Test App
                  </button>
                </div>

                <p className="text-center text-xs text-[#8697C4] mt-4">
                  By downloading, you agree to our testing terms and conditions
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
