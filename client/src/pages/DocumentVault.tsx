import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Filter,
  Plus,
  File,
  FileImage,
  FileSpreadsheet,
  X,
  Loader2,
  FolderOpen,
  Search,
} from "lucide-react";

const CATEGORIES = [
  { value: "warranty", label: "Warranty" },
  { value: "permit", label: "Permit" },
  { value: "insurance", label: "Insurance" },
  { value: "survey", label: "Survey" },
  { value: "legal", label: "Legal" },
  { value: "estimate", label: "Estimate" },
  { value: "manual", label: "Manual" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
] as const;

const BUILDINGS = [
  "Main House",
  "The Chalet",
  "Camp Kitchen",
  "Picnic Shelter",
  "Beach House",
  "Farm House",
  "Madrona House",
  "Caretaker House",
  "Boat House",
  "Generator Shed",
  "Lower Shop",
  "Upper Shop",
  "Pump Shed",
  "General / Whole Property",
];

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-500" />;
  if (mimeType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  return <File className="h-5 w-5 text-muted-foreground" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function DocumentVault() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterBuilding, setFilterBuilding] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Upload form state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("other");
  const [uploadBuilding, setUploadBuilding] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: documents = [], isLoading } = trpc.documents.list.useQuery({
    category: filterCategory || undefined,
    building: filterBuilding || undefined,
  });

  const uploadMutation = trpc.documents.upload.useMutation();
  const deleteMutation = trpc.documents.delete.useMutation();
  const utils = trpc.useUtils();

  // Filter documents by search term
  const filteredDocs = documents.filter((doc) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      doc.title.toLowerCase().includes(term) ||
      doc.filename.toLowerCase().includes(term) ||
      (doc.notes && doc.notes.toLowerCase().includes(term))
    );
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!uploadTitle) {
        // Auto-fill title from filename (without extension)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setUploadTitle(nameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) {
      toast({ title: "Missing info", description: "Please provide a title and select a file.", variant: "destructive" });
      return;
    }

    // 16MB limit
    if (selectedFile.size > 16 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 16 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      await uploadMutation.mutateAsync({
        title: uploadTitle.trim(),
        category: uploadCategory,
        filename: selectedFile.name,
        dataUrl,
        building: uploadBuilding || undefined,
        notes: uploadNotes || undefined,
      });

      await utils.documents.list.invalidate();
      toast({ title: "Document uploaded", description: `"${uploadTitle}" has been saved to the vault.` });

      // Reset form
      setUploadTitle("");
      setUploadCategory("other");
      setUploadBuilding("");
      setUploadNotes("");
      setSelectedFile(null);
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync({ id });
      await utils.documents.list.invalidate();
      toast({ title: "Deleted", description: `"${title}" has been removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete document.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Document Vault</h1>
          <p className="text-muted-foreground mt-1">
            Warranties, permits, insurance policies, surveys, and legal documents for the property.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
            {showUpload ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showUpload ? "Cancel" : "Upload Document"}
          </Button>
        )}
      </div>

      {/* Upload Form */}
      {showUpload && isAdmin && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload New Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Beach House Insurance Policy 2025"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Building (optional)</label>
                <select
                  value={uploadBuilding}
                  onChange={(e) => setUploadBuilding(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">— None —</option>
                  {BUILDINGS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">File *</label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Input
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                placeholder="Any additional notes about this document..."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={uploading || !selectedFile || !uploadTitle.trim()} className="gap-2">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={filterBuilding}
          onChange={(e) => setFilterBuilding(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Buildings</option>
          {BUILDINGS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="pl-9 h-9 w-48"
          />
        </div>
      </div>

      <Separator />

      {/* Document List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No documents found</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {documents.length === 0
              ? "Upload your first document to get started."
              : "Try adjusting your filters or search term."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getFileIcon(doc.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {doc.filename} &middot; {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
                          title="Download / View"
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </a>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(doc.id, doc.title)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {doc.category}
                      </Badge>
                      {doc.building && (
                        <Badge variant="outline" className="text-xs">
                          {doc.building}
                        </Badge>
                      )}
                      {doc.notes && (
                        <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                          {doc.notes}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                      Added {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {filteredDocs.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {filteredDocs.length} of {documents.length} document{documents.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
