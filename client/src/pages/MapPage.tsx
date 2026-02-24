import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Property locations matching Google Maps legend
const propertyLocations = [
  { id: "property-entrance", name: "Property Entrance", icon: "🚪" },
  { id: "main-house", name: "Main House", icon: "🏠" },
  { id: "chalet", name: "Chalet", icon: "🏠" },
  { id: "beach-house", name: "Beach House", icon: "🏠" },
  { id: "madrona", name: "Madrona", icon: "🏠" },
  { id: "caretaker-house", name: "Caretaker House", icon: "🏠" },
  { id: "farm-house", name: "Farm House", icon: "🏠" },
  { id: "picnic-pavilion", name: "Picnic Pavilion", icon: "🏕️" },
  { id: "boathouse", name: "Boathouse", icon: "⛵" },
  { id: "shops", name: "Shops", icon: "🔧" },
  { id: "equipment-yard", name: "Equipment Yard", icon: "🚜" },
  { id: "pump-shed-madrona", name: "Pump Shed - Madrona", icon: "💧" },
  { id: "water-tank", name: "Water Tank", icon: "💧" },
  { id: "upper-pond", name: "Upper Pond", icon: "🌊" },
  { id: "windmill-old-cabin", name: "Windmill and Old Cabin", icon: "🏚️" },
  { id: "point-2", name: "Point 2", icon: "📍" },
];

export default function MapPage() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Custom Property Map */}
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Custom Property Map
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.google.com/maps/d/edit?mid=1QinoM5BBuovuEr0y3uske36ijanEeLQ&ll=48.61938820024422%2C-122.99050494999999&z=16" target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Detailed property boundaries, parcels, and features</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Property Locations Legend */}
            <Card className="w-full lg:w-80 flex-shrink-0 border-0 shadow-none md:border md:shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Property Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[550px]">
                  <div className="px-4 pb-4 space-y-1">
                    {propertyLocations.map((location) => (
                      <div
                        key={location.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 cursor-pointer ${
                          hoveredLocation === location.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onMouseEnter={() => setHoveredLocation(location.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                      >
                        <span className="text-lg">{location.icon}</span>
                        <span>{location.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Embedded Map */}
            <div className="flex-1 h-[600px] rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1QinoM5BBuovuEr0y3uske36ijanEeLQ&ll=48.61938820024422%2C-122.99050494999999&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Custom Property Map"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
