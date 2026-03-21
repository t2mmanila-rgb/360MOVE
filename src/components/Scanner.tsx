import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, (_error) => {
      // Quietly handle scan errors (common during continuous scanning)
    });

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute -top-16 right-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black italic uppercase text-fs-orange mb-2">SCAN BOOTH QR.</h2>
          <p className="text-slate-400 text-sm font-medium">Position the QR code inside the frame to scan.</p>
        </div>
        <div id="reader" className="overflow-hidden rounded-3xl border-4 border-fs-cyan/30 shadow-2xl shadow-fs-cyan/20 bg-black" />
      </div>
    </div>
  );
};

export default Scanner;
