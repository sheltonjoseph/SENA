import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface BookingDetails {
  bookingId: string;
  qrCode: string;
  pdfTicketUrl: string;
  deskName: string;
  locationName: string;
  date: string;
  timeSlot: string;
  price: number;
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as BookingDetails;

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Booking Details Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Could not retrieve booking details. Please try again.</p>
            <Button onClick={() => navigate('/')} className="mt-4">Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    const input = document.getElementById('booking-details-card');
    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`booking_${bookingDetails.bookingId}.pdf`);
    }
  };

  const qrCodeValue = `Booking Confirmed! Date: ${bookingDetails.date}, Desk: ${bookingDetails.deskName}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Card className="w-full max-w-2xl p-8 shadow-xl" id="booking-details-card">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-green-600 mb-2">Booking Confirmed!</CardTitle>
          <p className="text-lg text-gray-700">Your workspace is ready.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 text-xl mb-3">Booking Details</h4>
              <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
              <p><strong>Desk:</strong> {bookingDetails.deskName}</p>
              <p><strong>Location:</strong> {bookingDetails.locationName}</p>
              <p><strong>Date:</strong> {bookingDetails.date}</p>
              <p><strong>Time Slot:</strong> {bookingDetails.timeSlot}</p>
              <p><strong>Price:</strong> ${bookingDetails.price}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h4 className="font-semibold text-gray-800 text-xl mb-3">QR Code</h4>
              {bookingDetails.qrCode && (
                <QRCodeSVG value={qrCodeValue} size={180} level="H" includeMargin={true} />
              )} 
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={handleDownloadPdf} className="bg-blue-600 hover:bg-blue-700">
              Download PDF Ticket
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage; 