import { useRef } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import toast from 'react-hot-toast';

export default function QRModal({ url, onClose }) {
  const qrRef = useRef();

  const copyLink = () => {
    navigator.clipboard.writeText(url.shortUrl);
    toast.success('Link copied!');
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${url.shortCode}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-white border-4 border-black rounded-2xl p-8 neo-shadow w-full max-w-md text-center flex flex-col items-center gap-6">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">qr_code_2</span>
            <span className="font-black text-lg">QR Code Vault</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div ref={qrRef} className="p-6 border-4 border-black rounded-xl neo-shadow">
          <QRCode value={url.shortUrl} size={180} level="H" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Shortened Link</p>
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border-2 border-black/10 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-sm opacity-50">link</span>
            <span className="font-bold text-xl text-primary">{url.shortUrl?.replace('http://localhost:5000/', '')}</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button onClick={downloadQR} className="w-full bg-primary-container border-4 border-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 neo-hover neo-active transition-all">
            <span className="material-symbols-outlined">download</span>
            Download QR
          </button>
          <button onClick={copyLink} className="w-full bg-white border-4 border-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 neo-hover neo-active transition-all">
            <span className="material-symbols-outlined">content_copy</span>
            Copy Link
          </button>
        </div>

        <div className="flex items-center gap-2 opacity-60">
          <span className="material-symbols-outlined text-base">verified</span>
          <span className="text-xs font-medium italic">Hand-crafted by LinkVault Artisan</span>
        </div>
      </div>
    </div>
  );
}