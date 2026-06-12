'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '237690041633';
const WHATSAPP_MESSAGE = 'Bonjour PES ! Je voudrais en savoir plus sur vos formules de soutien scolaire.';

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-sm hidden sm:block">WhatsApp</span>
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
    </motion.a>
  );
}
