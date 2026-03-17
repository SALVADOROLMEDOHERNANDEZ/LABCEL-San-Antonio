import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Verificar si ya está instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    
    if (isStandalone) {
      return; // Ya está instalada como app
    }

    // Mostrar instrucciones iOS después de 3 segundos
    if (isIOSDevice) {
      const dismissed = localStorage.getItem('pwa-ios-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowIOSInstructions(true), 3000);
      }
      return;
    }

    // Para Android/Desktop: capturar evento beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowInstall(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Instalación: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-ios-dismissed', 'true');
  };

  // Banner para Android/Desktop
  if (showInstall && deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-slide-in-up">
        <div className="bg-[#12121A] border border-[#00FF88]/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00FF88] to-[#00D4FF] rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-[#0A0A0F]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Instalar App</h3>
              <p className="text-sm text-gray-400 mb-3">
                Instala LABCEL en tu dispositivo para acceso rápido
              </p>
              <Button 
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-[#0A0A0F] font-bold h-10"
              >
                Instalar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Instrucciones para iOS
  if (showIOSInstructions && isIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-in-up">
        <div className="bg-[#12121A] border border-[#00FF88]/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00FF88] to-[#00D4FF] rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-[#0A0A0F]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Instalar en iPhone</h3>
              <p className="text-sm text-gray-400 mb-2">
                Para instalar LABCEL:
              </p>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Toca el botón <strong className="text-white">Compartir</strong> ⬆️</li>
                <li>Selecciona <strong className="text-white">"Agregar a Inicio"</strong></li>
                <li>Toca <strong className="text-white">"Agregar"</strong></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
