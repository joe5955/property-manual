import { Button } from "@/components/ui/button";
import { Wrench, Mail } from "lucide-react";

interface RequestQuoteButtonProps {
  buildingName: string;
  applianceName: string;
  modelNumber?: string;
  serialNumber?: string;
  age?: string;
  notes?: string;
}

export default function RequestQuoteButton({ 
  buildingName, 
  applianceName, 
  modelNumber, 
  serialNumber, 
  age,
  notes 
}: RequestQuoteButtonProps) {
  
  const handleRequestQuote = () => {
    const subject = `Quote Request: ${applianceName} Replacement for ${buildingName}`;
    
    const body = `Hello,

I would like to request a quote for replacing a ${applianceName} at my property (${buildingName}).

Current Unit Details:
- Appliance: ${applianceName}
- Model Number: ${modelNumber || "Not specified"}
- Serial Number: ${serialNumber || "Not specified"}
- Age: ${age || "Unknown"}
${notes ? `- Notes: ${notes}` : ""}

Please let me know if you need to schedule a site visit or if you can provide a rough estimate based on these details.

Thank you,
[Your Name]`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Button 
      onClick={handleRequestQuote}
      className="bg-red-600 hover:bg-red-700 text-white gap-2 w-full sm:w-auto shadow-sm"
    >
      <Mail className="h-4 w-4" />
      Request Replacement Quote
    </Button>
  );
}
