import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, AlertCircle, Lightbulb, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PhotoUploadForm() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<Array<{ number: number; description: string }>>([]);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const parseDescriptions = () => {
    setError("");
    setParsed([]);

    if (!input.trim()) {
      setError("Please paste your photo descriptions");
      return;
    }

    const lines = input.split("\n").filter(line => line.trim());
    const results: Array<{ number: number; description: string }> = [];
    
    for (const line of lines) {
      // Match patterns like "Photo 1: description" or "1: description" or "1. description"
      const match = line.match(/^(?:Photo\s*)?(\d+)[\s:.\-]+(.+)$/i);
      
      if (match) {
        const number = parseInt(match[1]);
        const description = match[2].trim();
        results.push({ number, description });
      }
    }

    if (results.length === 0) {
      setError("No valid photo descriptions found. Use format: 'Photo 1: Description' or '1: Description'");
      return;
    }

    setParsed(results);
  };

  const copyFormatted = () => {
    const formatted = parsed
      .map(p => `Photo #${p.number}: ${p.description}`)
      .join("\n");
    
    navigator.clipboard.writeText(formatted);
    toast({
      title: "Copied!",
      description: `${parsed.length} photo descriptions copied to clipboard`,
    });
  };

  const copyForManus = () => {
    const manusFormat = parsed
      .map(p => `Photo ${p.number}: ${p.description}`)
      .join("\n");
    
    navigator.clipboard.writeText(manusFormat);
    toast({
      title: "Ready for Manus!",
      description: "Paste this into Manus chat after uploading your photos",
    });
  };

  return (
    <div className="container py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Photo Upload Form</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Paste your numbered photo list from Google Keep, and I'll format it for Manus
        </p>
      </div>

      {/* Instructions */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 dark:text-blue-100">
          <strong className="block mb-2">How to use this form:</strong>
          <ol className="space-y-1 ml-4 text-sm">
            <li>1. Take photos in the field and number them in Google Keep</li>
            <li>2. Copy your numbered list from Google Keep</li>
            <li>3. Paste it into the box below and click "Parse Descriptions"</li>
            <li>4. Review the parsed results</li>
            <li>5. Click "Copy for Manus" and paste into Manus chat after uploading photos</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Step 1: Paste Your Photo List
          </CardTitle>
          <CardDescription>
            Paste from Google Keep in any of these formats:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-muted rounded-md">
              <p className="font-semibold mb-1">Format 1:</p>
              <p className="font-mono">Photo 1: Main House panel</p>
              <p className="font-mono">Photo 2: Farm House shutoff</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-semibold mb-1">Format 2:</p>
              <p className="font-mono">1: Main House panel</p>
              <p className="font-mono">2: Farm House shutoff</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-semibold mb-1">Format 3:</p>
              <p className="font-mono">1. Main House panel</p>
              <p className="font-mono">2. Farm House shutoff</p>
            </div>
          </div>

          <Textarea
            placeholder="Paste your photo descriptions here...&#10;&#10;Example:&#10;Photo 1: Main House electrical panel - Entry utility room&#10;Photo 2: Main House water shutoff - Basement&#10;Photo 3: Farm House breaker panel - Dining room"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <Button onClick={parseDescriptions} className="w-full" size="lg">
            Parse Descriptions
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {parsed.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Step 2: Review Parsed Results
              </CardTitle>
              <Badge className="bg-green-600">{parsed.length} Photos Found</Badge>
            </div>
            <CardDescription>
              Verify these descriptions match your photos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto space-y-2 p-4 bg-muted rounded-lg">
              {parsed.map((item) => (
                <div key={item.number} className="flex items-start gap-3 p-2 bg-background rounded border">
                  <Badge variant="outline" className="flex-shrink-0">#{item.number}</Badge>
                  <p className="text-sm flex-1">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button onClick={copyFormatted} variant="outline" className="w-full">
                <Copy className="mr-2 h-4 w-4" />
                Copy Formatted List
              </Button>
              <Button onClick={copyForManus} className="w-full bg-green-600 hover:bg-green-700">
                <Copy className="mr-2 h-4 w-4" />
                Copy for Manus Chat
              </Button>
            </div>

            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                <strong className="block mb-1">Next Steps:</strong>
                <ol className="space-y-1 ml-4 text-sm">
                  <li>1. Upload all {parsed.length} photos to Manus chat</li>
                  <li>2. Immediately paste the copied descriptions</li>
                  <li>3. Wait for AI confirmation</li>
                  <li>4. Request a checkpoint to save your work</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Google Keep Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Google Keep Tips</CardTitle>
          <CardDescription>Best practices for using Google Keep in the field</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Create a dedicated note for each field session</p>
              <p className="text-sm text-muted-foreground">Title it with the date: "Property Photos - Feb 18, 2026"</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Number as you go</p>
              <p className="text-sm text-muted-foreground">After taking each photo, add a new line: "Photo 1: Description"</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Use voice typing</p>
              <p className="text-sm text-muted-foreground">Tap the microphone icon in Google Keep to dictate descriptions hands-free</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Keep the template handy</p>
              <p className="text-sm text-muted-foreground font-mono">[Building] [Item Type] - [Location]</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
