import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Image as ImageIcon } from 'lucide-react';

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrCode = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");
    startCamera();

    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
        await html5QrCode.current.stop().catch(console.error);
    }
    setIsScanning(false);

    // Direct navigation without location verification for now
    navigate(`/my-pass?scan=${encodeURIComponent(decodedText)}`);
  };

  const startCamera = async () => {
    if (!html5QrCode.current) return;
    try {
      if (html5QrCode.current.isScanning) {
        await html5QrCode.current.stop();
      }
      setIsScanning(true);
      setError('');
      await html5QrCode.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        handleScanSuccess,
        () => {} // ignore repeated scan failures
      );
    } catch (err: any) {
      console.error(err);
      setError("Failed to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!html5QrCode.current) return;
    try {
      if (html5QrCode.current.isScanning) {
         await html5QrCode.current.stop();
         setIsScanning(false);
      }
      const decodedText = await html5QrCode.current.scanFile(file, true);
      handleScanSuccess(decodedText);
    } catch (err: any) {
      setError("No valid QR code found in the image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white z-50 hover:bg-white/20"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black italic uppercase text-fs-orange mb-2 tracking-tighter">SCAN BOOTH QR.</h2>
          <p className="text-slate-400 text-sm font-medium">Capture coordinates and code to earn points.</p>
        </div>

        <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-fs-cyan/30 shadow-[0_0_50px_rgba(45,212,191,0.2)] bg-black relative mb-8 flex items-center justify-center">
          <div id="reader" className="w-full h-full [&_video]:object-cover" />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center pt-24 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Ready to connect</div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-fs-pink text-xs font-bold uppercase tracking-widest mb-6 px-4 text-center">{error}</p>
        )}

        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={startCamera}
            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              isScanning ? 'bg-fs-orange/20 text-fs-orange border border-fs-orange/30' : 'bg-fs-orange text-white shadow-xl shadow-fs-orange/20'
            }`}
          >
            <Camera className="w-5 h-5" /> 
            {isScanning ? 'Camera Active' : 'Start Camera Scan'}
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-5 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
          >
            <ImageIcon className="w-5 h-5" /> Scan Image File
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
