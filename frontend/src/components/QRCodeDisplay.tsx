
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";

interface QRCodeDisplayProps {
  bookingId: string;
}

const QRCodeDisplay = ({ bookingId }: QRCodeDisplayProps) => {
  const [qrCodeData, setQrCodeData] = useState<string>("");

  useEffect(() => {
    // Generate QR code data (in real app, this would come from backend)
    const qrData = JSON.stringify({
      bookingId,
      timestamp: new Date().toISOString(),
      type: 'desk-booking',
      venue: 'downtown-office'
    });
    
    // Create a simple QR code placeholder (in real app, use react-qr-code or backend-generated image)
    const qrCodeSvg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" stroke-width="2"/>
        <rect x="30" y="30" width="30" height="30" fill="black"/>
        <rect x="140" y="30" width="30" height="30" fill="black"/>
        <rect x="30" y="140" width="30" height="30" fill="black"/>
        <rect x="80" y="80" width="40" height="40" fill="black"/>
        <text x="100" y="190" text-anchor="middle" font-size="8" font-family="monospace">${bookingId}</text>
      </svg>
    `;
    
    const dataUri = `data:image/svg+xml;base64,${btoa(qrCodeSvg)}`;
    setQrCodeData(dataUri);
  }, [bookingId]);

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <QrCode className="h-5 w-5 text-purple-600" />
          Quick Check-in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-100">
              {qrCodeData && (
                <img 
                  src={qrCodeData} 
                  alt="Booking QR Code" 
                  className="w-48 h-48"
                />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-slate-800">Scan for instant access</p>
            <p className="text-sm text-slate-600">
              Use your phone camera or the venue's scanner for quick check-in
            </p>
            <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
              {bookingId}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
