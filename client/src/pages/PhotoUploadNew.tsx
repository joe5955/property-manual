import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Download } from "lucide-react";
import Layout from "@/components/Layout";

interface PhotoItem {
  id: string;
  file: File;
  preview: string;
  label: string;
}

export default function PhotoUploadNew() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    addPhotos(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addPhotos(files);
    }
  };

  const addPhotos = (files: File[]) => {
    const newPhotos: PhotoItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      label: ""
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const updateLabel = (id: string, label: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, label } : p
    ));
  };

  const exportLabels = () => {
    const data = photos.map((photo, index) => ({
      number: index + 1,
      filename: photo.file.name,
      label: photo.label || "[Not labeled yet]"
    }));
    
    const text = data.map(d => 
      `${d.number}. ${d.filename}\n   Label: ${d.label}\n`
    ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'photo-labels.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Photo Upload & Labeling</h1>
          <p className="text-muted-foreground mt-2">
            Upload your property photos and label them for the manual
          </p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Photos</CardTitle>
            <CardDescription>
              Drag and drop photos here, or click to select files. Skip duplicates and fuzzy photos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop photos here</p>
              <p className="text-sm text-muted-foreground mb-4">or</p>
              <Button asChild>
                <label className="cursor-pointer">
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </Button>
            </div>
            
            {photos.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
                </p>
                <Button variant="outline" size="sm" onClick={exportLabels}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Labels
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <Card key={photo.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">Photo #{index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-xs truncate">
                    {photo.file.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={photo.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Label (Building - Item - Location)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Main House - Water Heater - Utility Room"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      value={photo.label}
                      onChange={(e) => updateLabel(photo.id, e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {photos.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No photos uploaded yet. Drop some photos above to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
