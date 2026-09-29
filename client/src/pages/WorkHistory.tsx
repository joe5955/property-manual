import { useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertTriangle,
  CalendarDays,
  ExternalLink,
  FileImage,
  Filter,
  History,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const CATEGORIES = [
  { value: "construction", label: "Construction" },
  { value: "repair", label: "Repair" },
  { value: "grounds", label: "Grounds" },
  { value: "utilities", label: "Utilities" },
  { value: "water", label: "Water" },
  { value: "marine", label: "Marine" },
  { value: "fire-safety", label: "Fire Safety" },
  { value: "forestry", label: "Forestry" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
] as const;

const LOCATIONS = [
  "Property-wide",
  "Main House",
  "The Chalet",
  "Beach House",
  "Caretaker House",
  "Madrona House",
  "Boat House",
  "Main Shop",
  "Tractor Shed",
  "Picnic Shelter",
  "Pump House",
  "Root Cellar",
  "Well System",
  "Pond / Lagoon",
  "Indian Point",
  "Multiple Buildings",
  "Madrona House / Old Well",
  "Undetermined",
];

function labelForCategory(value: string) {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value;
}

function deriveDateLabel(date: string) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkHistory() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);

  const [formSortDate, setFormSortDate] = useState("");
  const [formDateLabel, setFormDateLabel] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("other");
  const [formLocation, setFormLocation] = useState("Property-wide");
  const [formSourceImageUrl, setFormSourceImageUrl] = useState("");
  const [formSourceImageFilename, setFormSourceImageFilename] = useState("");
  const [formSourceText, setFormSourceText] = useState("");
  const [formNeedsReview, setFormNeedsReview] = useState(false);
  const [formNotes, setFormNotes] = useState("");

  const { data: records = [], isLoading } = trpc.workRecords.list.useQuery({});
  const createMutation = trpc.workRecords.create.useMutation();
  const updateMutation = trpc.workRecords.update.useMutation();
  const deleteMutation = trpc.workRecords.delete.useMutation();
  const uploadMutation = trpc.workRecords.uploadSource.useMutation();

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      if (filterCategory && record.category !== filterCategory) return false;
      if (filterLocation && record.location !== filterLocation) return false;
      if (reviewOnly && !record.needsReview) return false;
      if (!term) return true;
      return [record.title, record.description, record.location, record.notes, record.sourceText]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term));
    });
  }, [records, searchTerm, filterCategory, filterLocation, reviewOnly]);

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, typeof filteredRecords>();
    for (const record of filteredRecords) {
      const year = record.sortDate.slice(0, 4);
      const existing = groups.get(year) ?? [];
      existing.push(record);
      groups.set(year, existing);
    }
    return Array.from(groups.entries());
  }, [filteredRecords]);

  const knownLocations = useMemo(
    () => Array.from(new Set([...LOCATIONS, ...records.map((record) => record.location)])).sort(),
    [records],
  );
  const reviewCount = records.filter((record) => record.needsReview).length;
  const earliestYear = records[0]?.sortDate.slice(0, 4);
  const latestYear = records.at(-1)?.sortDate.slice(0, 4);

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setSourceFile(null);
    setFormSortDate("");
    setFormDateLabel("");
    setFormTitle("");
    setFormDescription("");
    setFormCategory("other");
    setFormLocation("Property-wide");
    setFormSourceImageUrl("");
    setFormSourceImageFilename("");
    setFormSourceText("");
    setFormNeedsReview(false);
    setFormNotes("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (record: (typeof records)[number]) => {
    setEditingId(record.id);
    setFormSortDate(record.sortDate);
    setFormDateLabel(record.dateLabel);
    setFormTitle(record.title);
    setFormDescription(record.description ?? "");
    setFormCategory(record.category);
    setFormLocation(record.location);
    setFormSourceImageUrl(record.sourceImageUrl ?? "");
    setFormSourceImageFilename(record.sourceImageFilename ?? "");
    setFormSourceText(record.sourceText ?? "");
    setFormNeedsReview(record.needsReview);
    setFormNotes(record.notes ?? "");
    setSourceFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDateChange = (date: string) => {
    setFormSortDate(date);
    if (!editingId || !formDateLabel) setFormDateLabel(deriveDateLabel(date));
  };

  const handleSave = async () => {
    if (!formSortDate || !formDateLabel.trim() || !formTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Date, display date, and work title are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let sourceImageUrl = formSourceImageUrl || undefined;
      let sourceImageFilename = formSourceImageFilename || undefined;

      if (sourceFile) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(sourceFile);
        });
        const uploaded = await uploadMutation.mutateAsync({ dataUrl, filename: sourceFile.name });
        sourceImageUrl = uploaded.url;
        sourceImageFilename = uploaded.filename;
      }

      const payload = {
        sortDate: formSortDate,
        dateLabel: formDateLabel.trim(),
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        category: formCategory,
        location: formLocation,
        sourceImageUrl,
        sourceImageFilename,
        sourceText: formSourceText.trim() || undefined,
        needsReview: formNeedsReview,
        notes: formNotes.trim() || undefined,
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        toast({ title: "Work record updated", description: `“${formTitle}” has been updated.` });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Work record added", description: `“${formTitle}” has been added to the history.` });
      }

      await utils.workRecords.list.invalidate();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Could not save record",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete “${title}” from the work history?`)) return;
    try {
      await deleteMutation.mutateAsync({ id });
      await utils.workRecords.list.invalidate();
      toast({ title: "Work record deleted", description: `“${title}” was removed.` });
    } catch {
      toast({ title: "Delete failed", description: "The work record could not be deleted.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <History className="h-3.5 w-3.5" /> Partial historical archive
            </Badge>
            {earliestYear && latestYear && <Badge variant="outline">{earliestYear}–{latestYear}</Badge>}
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Work History</h1>
            <p className="mt-2 text-muted-foreground">
              A chronological record of known construction, repairs, grounds work, utilities, and improvements. This archive is useful but not comprehensive.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Entries marked <strong>Needs review</strong> contain uncertain handwriting, dates, or locations. The original photographed note is linked whenever available.
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} className="gap-2">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Work Record"}
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-primary" />
              {editingId ? "Edit Work Record" : "Add Work Record"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort date *</label>
                <Input type="date" value={formSortDate} onChange={(event) => handleDateChange(event.target.value)} />
                <p className="text-xs text-muted-foreground">Use the first day for approximate months or years.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Display date *</label>
                <Input value={formDateLabel} onChange={(event) => setFormDateLabel(event.target.value)} placeholder="February–March 2024" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select value={formCategory} onChange={(event) => setFormCategory(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Work title *</label>
                <Input value={formTitle} onChange={(event) => setFormTitle(event.target.value)} placeholder="e.g. Replaced Pump House roof" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <select value={formLocation} onChange={(event) => setFormLocation(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {knownLocations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formDescription} onChange={(event) => setFormDescription(event.target.value)} placeholder="What was completed?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Literal source transcription</label>
                <Textarea value={formSourceText} onChange={(event) => setFormSourceText(event.target.value)} placeholder="Copy the original wording when available." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea value={formNotes} onChange={(event) => setFormNotes(event.target.value)} placeholder="Clarifications, follow-up, or provenance." />
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source-note photo</label>
                  <Input ref={fileInputRef} type="file" accept="image/*" onChange={(event) => setSourceFile(event.target.files?.[0] ?? null)} />
                  {formSourceImageUrl && !sourceFile && (
                    <a href={formSourceImageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <FileImage className="h-3.5 w-3.5" /> Current source image
                    </a>
                  )}
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm">
                  <input type="checkbox" checked={formNeedsReview} onChange={(event) => setFormNeedsReview(event.target.checked)} className="h-4 w-4" />
                  Mark this transcription as needing review
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : editingId ? "Update Record" : "Add Record"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Known work records</p>
            <p className="mt-1 text-3xl font-serif font-bold">{records.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Need owner review</p>
            <p className="mt-1 text-3xl font-serif font-bold text-amber-700 dark:text-amber-400">{reviewCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Locations represented</p>
            <p className="mt-1 text-3xl font-serif font-bold">{new Set(records.map((record) => record.location)).size}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" /> Filter
        </div>
        <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All categories</option>
          {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
        </select>
        <select value={filterLocation} onChange={(event) => setFilterLocation(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All locations</option>
          {knownLocations.map((location) => <option key={location} value={location}>{location}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={reviewOnly} onChange={(event) => setReviewOnly(event.target.checked)} className="h-4 w-4" />
          Needs review only
        </label>
        <div className="relative ml-auto min-w-56 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search work history..." className="h-9 pl-9" />
        </div>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-16 text-center">
          <History className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="text-lg font-medium text-muted-foreground">No work records match these filters</h2>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedRecords.map(([year, yearRecords]) => (
            <section key={year} className="grid gap-5 lg:grid-cols-[100px_1fr]">
              <div className="lg:sticky lg:top-6 lg:self-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-serif font-bold">{year}</span>
                </div>
              </div>
              <div className="space-y-4 border-l-2 border-primary/20 pl-5">
                {yearRecords.map((record) => (
                  <Card key={record.id} className="relative overflow-hidden transition-shadow hover:shadow-md">
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary/60" />
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-primary">{record.dateLabel}</span>
                            <Badge variant="secondary">{labelForCategory(record.category)}</Badge>
                            <Badge variant="outline" className="gap-1"><MapPin className="h-3 w-3" /> {record.location}</Badge>
                            {record.needsReview && (
                              <Badge className="gap-1 border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                                <AlertTriangle className="h-3 w-3" /> Needs review
                              </Badge>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{record.title}</h3>
                            {record.description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{record.description}</p>}
                          </div>
                          {record.sourceText && (
                            <blockquote className="border-l-2 border-muted-foreground/30 pl-3 text-xs italic text-muted-foreground">
                              Source note: “{record.sourceText}”
                            </blockquote>
                          )}
                          <div className="flex flex-wrap items-center gap-3">
                            {record.sourceImageUrl && (
                              <a href={record.sourceImageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                                <FileImage className="h-3.5 w-3.5" /> View source note <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {record.notes && <span className="text-xs text-muted-foreground">{record.notes}</span>}
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex shrink-0 items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(record)} title="Edit record"><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id, record.title)} className="text-muted-foreground hover:text-destructive" title="Delete record"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {filteredRecords.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">Showing {filteredRecords.length} of {records.length} known work records, oldest to newest.</p>
      )}
    </div>
  );
}
