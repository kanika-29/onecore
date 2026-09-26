import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function PrescriptionDisclaimer() {
  return (
    <section className="py-8 sm:py-10 px-4 sm:px-8 bg-[#FAF9F6] border-t border-b border-[#E5E3DC]">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E3DC] border-l-[4px] border-l-[#D52B1E] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="p-3 rounded-full bg-[#D52B1E]/10 text-[#D52B1E] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D52B1E] block">
              MANDATORY PRESCRIPTION MEDICINE INFORMATION
            </span>
            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed font-normal">
              This product is a prescription medicine. Use only under the supervision and advice of a qualified healthcare professional. This webpage is intended for general informational purposes and does not replace medical advice, diagnosis, or treatment. Please read the package insert or prescribing information before use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
