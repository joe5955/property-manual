import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import {
  Zap, Droplets, Sprout, Flame, CircleDot, Lightbulb, Building2,
  Shovel, HelpCircle, X, ChevronLeft, ChevronRight, Printer, Plus,
  MapPin, Camera, Pencil, Trash2, Check, AlertCircle
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────

const SHEETS = [
  { id: 1, label: "A-1.0", title: "Property Overview" },
  { id: 2, label: "A-2.0", title: "Main House Area" },
  { id: 3, label: "A-3.0", title: "Farm House / Beach House" },
  { id: 4, label: "A-4.0", title: "Madrona House" },
  { id: 5, label: "A-5.0", title: "Water System / Upper Road" },
  { id: 6, label: "A-6.0", title: "Lower & Upper Shop" },
  { id: 7, label: "A-7.0", title: "Water System Detail" },
];

const SHEET_IMAGES: Record<number, string> = {
  1: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg1-1_192e472d.png",
  2: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg2-1_cc1c23d3.png",
  3: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg3-1_87be8c21.png",
  4: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg4-1_5b6047c5.png",
  5: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg5-1_8a40cb48.png",
  6: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg6-1_e6dd6c01.png",
  7: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/SCpg7-1_58e61adc.png",
};

type Category = "electrical" | "water" | "irrigation" | "gas" | "septic" | "lighting" | "building" | "excavation" | "other";

const CATEGORIES: { id: Category; label: string; color: string; bgColor: string; borderColor: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "electrical", label: "Electrical", color: "text-yellow-700", bgColor: "bg-yellow-400", borderColor: "border-yellow-500", Icon: Zap },
  { id: "water",      label: "Water",      color: "text-blue-700",   bgColor: "bg-blue-400",   borderColor: "border-blue-500",   Icon: Droplets },
  { id: "irrigation", label: "Irrigation", color: "text-green-700",  bgColor: "bg-green-500",  borderColor: "border-green-600",  Icon: Sprout },
  { id: "gas",        label: "Gas/Propane",color: "text-orange-700", bgColor: "bg-orange-400", borderColor: "border-orange-500", Icon: Flame },
  { id: "septic",     label: "Septic",     color: "text-amber-800",  bgColor: "bg-amber-600",  borderColor: "border-amber-700",  Icon: CircleDot },
  { id: "lighting",   label: "Lighting",   color: "text-purple-700", bgColor: "bg-purple-400", borderColor: "border-purple-500", Icon: Lightbulb },
  { id: "building",   label: "Building",   color: "text-emerald-700",bgColor: "bg-emerald-600",borderColor: "border-emerald-700",Icon: Building2 },
  { id: "excavation", label: "Excavation", color: "text-red-700",    bgColor: "bg-red-500",    borderColor: "border-red-600",    Icon: Shovel },
  { id: "other",      label: "Other",      color: "text-gray-700",   bgColor: "bg-gray-400",   borderColor: "border-gray-500",   Icon: HelpCircle },
];

function getCat(id: string) {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Pin {
  id: number;
  sheetId: number;
  title: string;
  notes: string | null;
  category: string;
  positionX: number;
  positionY: number;
  photos: string[];
  manualSectionId: string | null;
}

// ── Pin Marker ───────────────────────────────────────────────────────────────

function PinMarker({ pin, isActive, dimmed, onClick }: {
  pin: Pin; isActive: boolean; dimmed: boolean; onClick: () => void;
}) {
  const cat = getCat(pin.category);
  const Icon = cat.Icon;
  return (
    <button
      onClick={onClick}
      style={{ left: `${pin.positionX}%`, top: `${pin.positionY}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 group
        ${dimmed ? "opacity-20 scale-75" : "opacity-100"}
        ${isActive ? "scale-125 z-20" : "hover:scale-110"}`}
      title={pin.title}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2
        ${cat.bgColor} ${cat.borderColor}
        ${isActive ? "ring-2 ring-white ring-offset-1" : ""}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
    </button>
  );
}

// ── Pin Popup ────────────────────────────────────────────────────────────────

function PinPopup({ pin, onClose, onEdit, onDelete, isAdmin }: {
  pin: Pin; onClose: () => void; onEdit: () => void; onDelete: () => void; isAdmin: boolean;
}) {
  const cat = getCat(pin.category);
  const Icon = cat.Icon;
  const [photoIdx, setPhotoIdx] = useState(0);
  const pinUrl = `${window.location.origin}/map?pin=${pin.id}`;

  return (
    <div className="absolute bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 overflow-hidden">
      {/* Header */}
      <div className={`${cat.bgColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white" />
          <span className="text-white font-semibold text-sm truncate max-w-[180px]">{pin.title}</span>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <>
              <button onClick={onEdit} className="text-white/80 hover:text-white p-1 rounded">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete} className="text-white/80 hover:text-white p-1 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photos */}
      {pin.photos.length > 0 && (
        <div className="relative bg-gray-100">
          <img
            src={pin.photos[photoIdx]}
            alt={`Photo ${photoIdx + 1}`}
            className="w-full h-44 object-cover"
          />
          {pin.photos.length > 1 && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
              {pin.photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === photoIdx ? "bg-white" : "bg-white/50"}`} />
              ))}
            </div>
          )}
          {pin.photos.length > 1 && (
            <>
              <button onClick={() => setPhotoIdx(i => Math.max(0, i - 1))}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button onClick={() => setPhotoIdx(i => Math.min(pin.photos.length - 1, i + 1))}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60">
                <ChevronRight className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Notes */}
      {pin.notes && (
        <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
          {pin.notes}
        </div>
      )}

      {/* QR + Category */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <Badge variant="outline" className={`text-xs ${cat.color}`}>
            {cat.label}
          </Badge>
          {pin.photos.length === 0 && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Camera className="w-3 h-3" /> No photos yet
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <QRCodeSVG value={pinUrl} size={52} />
          <span className="text-[10px] text-gray-400">Scan for field use</span>
        </div>
      </div>
    </div>
  );
}

// ── Add/Edit Pin Form ─────────────────────────────────────────────────────────

function PinForm({ sheetId, position, existing, onSave, onCancel }: {
  sheetId: number;
  position?: { x: number; y: number };
  existing?: Pin;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [category, setCategory] = useState<Category>((existing?.category as Category) ?? "other");
  const [photosText, setPhotosText] = useState(existing?.photos.join("\n") ?? "");

  const createPin = trpc.mapPins.create.useMutation();
  const updatePin = trpc.mapPins.update.useMutation();
  const utils = trpc.useUtils();

  const handleSave = async () => {
    const photos = photosText.split("\n").map(s => s.trim()).filter(Boolean);
    if (existing) {
      await updatePin.mutateAsync({ id: existing.id, title, notes, category, photos });
    } else if (position) {
      await createPin.mutateAsync({
        sheetId, title, notes, category,
        positionX: position.x, positionY: position.y, photos,
      });
    }
    await utils.mapPins.list.invalidate();
    onSave();
  };

  const isPending = createPin.isPending || updatePin.isPending;

  return (
    <div className="absolute bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">{existing ? "Edit Pin" : "Add Pin"}</span>
        <button onClick={onCancel} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="e.g. Main Electrical Panel" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Category</label>
          <div className="grid grid-cols-3 gap-1">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs border transition-colors
                  ${category === cat.id ? `${cat.bgColor} text-white border-transparent` : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <cat.Icon className="w-3 h-3" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            placeholder="Description, depth, pipe size, date..." />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Photo URLs (one per line)</label>
          <textarea value={photosText} onChange={e => setPhotosText(e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            placeholder="https://..." />
        </div>
        <div className="flex gap-2 pt-1">
          <Button onClick={handleSave} disabled={!title || isPending} size="sm" className="flex-1">
            {isPending ? "Saving..." : <><Check className="w-3.5 h-3.5 mr-1" /> Save Pin</>}
          </Button>
          <Button onClick={onCancel} variant="outline" size="sm">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// ── Print Field Sheet ─────────────────────────────────────────────────────────

function PrintFieldSheet({ pins, sheetId, onClose }: { pins: Pin[]; sheetId: number; onClose: () => void }) {
  const sheet = SHEETS.find(s => s.id === sheetId);
  const baseUrl = window.location.origin;

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-8 print:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <h2 className="text-xl font-bold">Field Sheet — {sheet?.title}</h2>
          <Button onClick={onClose} variant="outline" size="sm"><X className="w-4 h-4 mr-1" /> Close</Button>
        </div>
        <div className="print:block">
          <div className="text-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold">Shady Cove LLC — Property Manual</h1>
            <p className="text-gray-600 mt-1">Site Plan Field Reference Sheet — {sheet?.label}: {sheet?.title}</p>
            <p className="text-xs text-gray-400 mt-1">Scan QR codes to view location details, photos, and notes</p>
          </div>

          {pins.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No pins on this sheet yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {pins.map((pin, idx) => {
                const cat = getCat(pin.category);
                const Icon = cat.Icon;
                const pinUrl = `${baseUrl}/map?pin=${pin.id}`;
                return (
                  <div key={pin.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 break-inside-avoid">
                    <div className="flex-shrink-0">
                      <QRCodeSVG value={pinUrl} size={80} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${cat.bgColor}`}>
                          <Icon className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="font-semibold text-sm truncate">{pin.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{cat.label}</p>
                      {pin.notes && <p className="text-xs text-gray-600 line-clamp-3">{pin.notes}</p>}
                      {pin.photos.length > 0 && (
                        <p className="text-xs text-blue-500 mt-1">{pin.photos.length} photo{pin.photos.length > 1 ? "s" : ""}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400 print:block">
            Printed from {baseUrl} — Property Manual, San Juan County Estate
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MapPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeSheet, setActiveSheet] = useState(2); // default to Main House
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set());
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [addingPin, setAddingPin] = useState(false);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  const [showPrint, setShowPrint] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const utils = trpc.useUtils();

  const { data: allPins = [] } = trpc.mapPins.list.useQuery({});
  const deletePin = trpc.mapPins.delete.useMutation({
    onSuccess: () => utils.mapPins.list.invalidate(),
  });

  const sheetPins = allPins.filter(p => p.sheetId === activeSheet);
  const visiblePins = activeCategories.size === 0
    ? sheetPins
    : sheetPins.filter(p => activeCategories.has(p.category as Category));

  const toggleCategory = (cat: Category) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!addingPin || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPos({ x, y });
    setAddingPin(false);
  }, [addingPin]);

  // Check URL for direct pin link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pinId = params.get("pin");
    if (pinId && allPins.length > 0) {
      const pin = allPins.find(p => p.id === Number(pinId));
      if (pin) {
        setActiveSheet(pin.sheetId);
        setActivePin(pin);
      }
    }
  }, [allPins]);

  const handleDeletePin = async (pin: Pin) => {
    if (!confirm(`Delete pin "${pin.title}"?`)) return;
    await deletePin.mutateAsync({ id: pin.id });
    setActivePin(null);
  };

  const sheet = SHEETS.find(s => s.id === activeSheet)!;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 flex-wrap">
        {/* Sheet Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {SHEETS.map(s => (
            <button key={s.id} onClick={() => { setActiveSheet(s.id); setActivePin(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${activeSheet === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100"}`}>
              <span className="font-mono">{s.label}</span>
              <span className="hidden sm:inline ml-1 text-[11px] opacity-70">— {s.title}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPrint(true)}>
            <Printer className="w-3.5 h-3.5 mr-1" /> Print Field Sheet
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => { setAddingPin(true); setActivePin(null); setPendingPos(null); }}
              className={addingPin ? "bg-orange-500 hover:bg-orange-600" : ""}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              {addingPin ? "Click map to place pin" : "Add Pin"}
            </Button>
          )}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium mr-1">Layers:</span>
        {CATEGORIES.map(cat => {
          const active = activeCategories.has(cat.id);
          const Icon = cat.Icon;
          const count = sheetPins.filter(p => p.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button key={cat.id} onClick={() => toggleCategory(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                ${active
                  ? `${cat.bgColor} text-white border-transparent shadow-sm`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
              <Icon className="w-3 h-3" />
              {cat.label}
              <span className={`text-[10px] ${active ? "text-white/80" : "text-gray-400"}`}>({count})</span>
            </button>
          );
        })}
        {activeCategories.size > 0 && (
          <button onClick={() => setActiveCategories(new Set())}
            className="text-xs text-gray-400 hover:text-gray-600 ml-1">
            Show all
          </button>
        )}
        {sheetPins.length === 0 && (
          <span className="text-xs text-gray-400 italic">No pins on this sheet yet</span>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 overflow-auto relative">
        <div
          className={`relative inline-block min-w-full ${addingPin ? "cursor-crosshair" : "cursor-default"}`}
          onClick={handleMapClick}
        >
          <img
            ref={imgRef}
            src={SHEET_IMAGES[activeSheet]}
            alt={`Site Plan ${sheet.label}`}
            className="w-full block select-none"
            draggable={false}
          />

          {/* Pins */}
          {sheetPins.map(pin => (
            <PinMarker
              key={pin.id}
              pin={pin}
              isActive={activePin?.id === pin.id}
              dimmed={activeCategories.size > 0 && !activeCategories.has(pin.category as Category)}
              onClick={() => {
                if (addingPin) return;
                setActivePin(activePin?.id === pin.id ? null : pin);
                setPendingPos(null);
                setEditingPin(null);
              }}
            />
          ))}

          {/* Pending pin placement indicator */}
          {pendingPos && (
            <div style={{ left: `${pendingPos.x}%`, top: `${pendingPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-800 border-2 border-white shadow-lg flex items-center justify-center z-20 animate-pulse">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
          )}

          {/* Active pin popup */}
          {activePin && !editingPin && !pendingPos && (
            <PinPopup
              pin={activePin}
              onClose={() => setActivePin(null)}
              onEdit={() => { setEditingPin(activePin); setActivePin(null); }}
              onDelete={() => handleDeletePin(activePin)}
              isAdmin={isAdmin}
            />
          )}

          {/* Add pin form */}
          {pendingPos && (
            <PinForm
              sheetId={activeSheet}
              position={pendingPos}
              onSave={() => { setPendingPos(null); }}
              onCancel={() => setPendingPos(null)}
            />
          )}

          {/* Edit pin form */}
          {editingPin && (
            <PinForm
              sheetId={activeSheet}
              existing={editingPin}
              onSave={() => { setEditingPin(null); }}
              onCancel={() => setEditingPin(null)}
            />
          )}
        </div>
      </div>

      {/* Print Sheet */}
      {showPrint && (
        <PrintFieldSheet
          pins={sheetPins}
          sheetId={activeSheet}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
}
