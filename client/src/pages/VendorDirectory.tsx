import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  Plus,
  Trash2,
  Pencil,
  Phone,
  Mail,
  Globe,
  X,
  Loader2,
  Search,
  Star,
  Building2,
  Filter,
  Save,
} from "lucide-react";

const TRADES = [
  { value: "roofing", label: "Roofing" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "septic", label: "Septic" },
  { value: "general", label: "General Contractor" },
  { value: "landscaping", label: "Landscaping" },
  { value: "marine", label: "Marine" },
  { value: "appliance", label: "Appliance" },
  { value: "pest", label: "Pest Control" },
  { value: "well", label: "Well / Water" },
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

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} ${onChange ? "cursor-pointer hover:text-amber-400" : ""}`}
          onClick={() => onChange?.(star)}
        />
      ))}
    </div>
  );
}

export default function VendorDirectory() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();

  // Filters
  const [filterTrade, setFilterTrade] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formTrade, setFormTrade] = useState("other");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formBuilding, setFormBuilding] = useState("");
  const [formLicense, setFormLicense] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [saving, setSaving] = useState(false);

  // Queries
  const { data: vendors = [], isLoading } = trpc.vendors.list.useQuery({
    trade: filterTrade || undefined,
  });

  const createMutation = trpc.vendors.create.useMutation();
  const updateMutation = trpc.vendors.update.useMutation();
  const deleteMutation = trpc.vendors.delete.useMutation();
  const utils = trpc.useUtils();

  // Filter by search
  const filteredVendors = vendors.filter((v) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.company && v.company.toLowerCase().includes(term)) ||
      (v.notes && v.notes.toLowerCase().includes(term)) ||
      v.trade.toLowerCase().includes(term)
    );
  });

  const resetForm = () => {
    setFormName("");
    setFormCompany("");
    setFormTrade("other");
    setFormPhone("");
    setFormEmail("");
    setFormWebsite("");
    setFormNotes("");
    setFormBuilding("");
    setFormLicense("");
    setFormRating(0);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (vendor: typeof vendors[0]) => {
    setEditingId(vendor.id);
    setFormName(vendor.name);
    setFormCompany(vendor.company ?? "");
    setFormTrade(vendor.trade);
    setFormPhone(vendor.phone ?? "");
    setFormEmail(vendor.email ?? "");
    setFormWebsite(vendor.website ?? "");
    setFormNotes(vendor.notes ?? "");
    setFormBuilding(vendor.building ?? "");
    setFormLicense(vendor.license ?? "");
    setFormRating(vendor.rating ?? 0);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast({ title: "Missing info", description: "Please provide a contact name.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        company: formCompany || undefined,
        trade: formTrade,
        phone: formPhone || undefined,
        email: formEmail || undefined,
        website: formWebsite || undefined,
        notes: formNotes || undefined,
        building: formBuilding || undefined,
        license: formLicense || undefined,
        rating: formRating > 0 ? formRating : undefined,
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        toast({ title: "Updated", description: `"${formName}" has been updated.` });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Added", description: `"${formName}" has been added to the directory.` });
      }

      await utils.vendors.list.invalidate();
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Remove "${name}" from the directory?`)) return;
    try {
      await deleteMutation.mutateAsync({ id });
      await utils.vendors.list.invalidate();
      toast({ title: "Removed", description: `"${name}" has been removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete vendor.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Vendor Directory</h1>
          <p className="text-muted-foreground mt-1">
            Contractors, service providers, and suppliers for the property.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className="gap-2">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Vendor"}
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && isAdmin && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {editingId ? "Edit Vendor" : "Add New Vendor"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Name *</label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. John Smith"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="e.g. Island Plumbing LLC"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trade</label>
                <select
                  value={formTrade}
                  onChange={(e) => setFormTrade(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {TRADES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="(360) 555-1234"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Building (optional)</label>
                <select
                  value={formBuilding}
                  onChange={(e) => setFormBuilding(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">— None —</option>
                  {BUILDINGS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">License #</label>
                <Input
                  value={formLicense}
                  onChange={(e) => setFormLicense(e.target.value)}
                  placeholder="License or registration number"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <StarRating rating={formRating} onChange={setFormRating} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !formName.trim()} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : editingId ? "Update" : "Add Vendor"}
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
          value={filterTrade}
          onChange={(e) => setFilterTrade(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Trades</option>
          {TRADES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors..."
            className="pl-9 h-9 w-48"
          />
        </div>
      </div>

      <Separator />

      {/* Vendor List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No vendors found</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {vendors.length === 0
              ? "Add your first vendor to get started."
              : "Try adjusting your filters or search term."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                    {vendor.company && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {vendor.company}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => startEdit(vendor)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(vendor.id, vendor.name)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {TRADES.find(t => t.value === vendor.trade)?.label || vendor.trade}
                  </Badge>
                  {vendor.building && (
                    <Badge variant="outline" className="text-xs">
                      {vendor.building}
                    </Badge>
                  )}
                  {vendor.rating && vendor.rating > 0 && (
                    <StarRating rating={vendor.rating} />
                  )}
                </div>

                <div className="mt-3 space-y-1.5">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-3.5 w-3.5" />
                      {vendor.phone}
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-3.5 w-3.5" />
                      {vendor.email}
                    </a>
                  )}
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="h-3.5 w-3.5" />
                      {vendor.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>

                {vendor.notes && (
                  <p className="text-xs text-muted-foreground italic mt-3 border-t pt-2">
                    {vendor.notes}
                  </p>
                )}

                {vendor.license && (
                  <p className="text-[11px] text-muted-foreground/60 mt-2">
                    License: {vendor.license}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {filteredVendors.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {filteredVendors.length} of {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
