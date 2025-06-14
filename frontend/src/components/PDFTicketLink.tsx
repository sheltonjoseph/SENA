
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PDFTicketLinkProps {
  bookingId: string;
}

const PDFTicketLink = ({ bookingId }: PDFTicketLinkProps) => {
  const handleDownload = () => {
    // Placeholder for actual PDF generation
    console.log('Generating PDF ticket for booking:', bookingId);
    
    toast({
      title: "PDF Ticket Generated",
      description: "Your booking ticket has been downloaded",
      duration: 3000,
    });

    // In a real app, this would trigger a download from the server
    // const pdfUrl = `/api/tickets/${bookingId}/pdf`;
    // window.open(pdfUrl, '_blank');
  };

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <FileText className="h-5 w-5 text-blue-600" />
          Booking Ticket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Booking Reference</p>
              <p className="text-sm text-slate-600 font-mono">{bookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Format</p>
              <p className="font-medium text-slate-800">PDF</p>
            </div>
          </div>
          
          <Button 
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Ticket
          </Button>
          
          <p className="text-xs text-slate-500 text-center">
            Present this ticket at the reception desk or scan the QR code for quick check-in
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFTicketLink;
