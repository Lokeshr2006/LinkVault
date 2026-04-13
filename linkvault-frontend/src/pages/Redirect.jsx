import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Redirect() {
  const { shortCode } = useParams();

  useEffect(() => {
    const doRedirect = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/urls/redirect/${shortCode}`
        );
        window.location.href = res.data.originalUrl;
      } catch {
        window.location.href = '/';
      }
    };
    doRedirect();
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl font-black mb-4">LinkVault</div>
        <div className="w-8 h-8 border-4 border-black border-t-primary-container rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-on-surface-variant">Redirecting you...</p>
      </div>
    </div>
  );
}