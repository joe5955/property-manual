import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Save } from "lucide-react";
import Layout from "@/components/Layout";

interface PhotoLabel {
  number: number;
  filename: string;
  label: string;
}

export default function PhotoLabeling() {
  const [labels, setLabels] = useState<PhotoLabel[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Initialize with 126 photos
    const initialLabels: PhotoLabel[] = [];
    for (let i = 0; i < 126; i++) {
      const num = String(i).padStart(3, '0');
      initialLabels.push({
        number: i + 1,
        filename: `photo-${num}.jpg`,
        label: ""
      });
    }
    setLabels(initialLabels);
  }, []);

  const updateLabel = (number: number, label: string) => {
    setLabels(prev => prev.map(p => 
      p.number === number ? { ...p, label } : p
    ));
  };

  const exportLabels = () => {
    const text = labels
      .filter(p => p.label.trim() !== "")
      .map(p => `${p.number}. ${p.filename}\n   ${p.label}\n`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'photo-labels.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveProgress = () => {
    localStorage.setItem('photo-labels', JSON.stringify(labels));
    alert('Progress saved!');
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('photo-labels');
    if (saved) {
      setLabels(JSON.parse(saved));
      alert('Progress loaded!');
    }
  };

  useEffect(() => {
    // Auto-load saved progress on mount
    const saved = localStorage.getItem('photo-labels');
    if (saved) {
      setLabels(JSON.parse(saved));
    }
  }, []);

  const filteredLabels = filter.trim() === "" 
    ? labels 
    : labels.filter(p => 
        p.label.toLowerCase().includes(filter.toLowerCase()) ||
        p.number.toString().includes(filter)
      );

  const labeledCount = labels.filter(p => p.label.trim() !== "").length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Photo Labeling</h1>
            <p className="text-muted-foreground mt-2">
              Label all {labels.length} photos extracted from your Google Doc
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveProgress}>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
            <Button variant="outline" onClick={exportLabels}>
              <Download className="h-4 w-4 mr-2" />
              Export Labels
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              {labeledCount} of {labels.length} photos labeled ({Math.round((labeledCount / labels.length) * 100)}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${(labeledCount / labels.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Input
            placeholder="Filter by label or number..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          {filter && (
            <Button variant="ghost" onClick={() => setFilter("")}>
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabels.map((photo) => (
            <Card key={photo.number} className={photo.label ? "border-primary/50" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Photo #{photo.number}</span>
                  {photo.label && (
                    <span className="text-xs font-normal text-green-600">✓ Labeled</span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  {photo.filename}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <img
                    src={`/extracted-photos/${photo.filename}`}
                    alt={`Photo ${photo.number}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Label (Building - Item - Location)
                  </label>
                  <Input
                    placeholder="e.g., Main House - Water Heater - Utility Room"
                    value={photo.label}
                    onChange={(e) => updateLabel(photo.number, e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLabels.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No photos match your filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
