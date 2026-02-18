import { useState, useMemo } from "react";
import { InteractiveMap, MapMarker } from "@/components/InteractiveMap";
import { manualData, ManualSection, ManualSubsection, ManualItem } from "@/data/manual-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Extract all items with location data from the manual
  const markers: MapMarker[] = useMemo(() => {
    const allMarkers: MapMarker[] = [];
    
    manualData.sections.forEach((section: ManualSection) => {
      section.subsections?.forEach((subsection: ManualSubsection) => {
        if (subsection.items) {
          subsection.items.forEach((item: ManualItem) => {
            if (item.location) {
              allMarkers.push({
                id: item.id,
                position: item.location,
                title: item.title,
                description: `${section.title} - ${subsection.title}`
              });
            }
          });
        }
      });
    });
    
    return allMarkers;
  }, []);

  const handleMarkerClick = (markerId: string) => {
    setActiveMarkerId(markerId);
  };

  const handleItemClick = (markerId: string) => {
    setActiveMarkerId(markerId);
  };

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Sidebar List */}
        <Card className="w-full md:w-1/3 h-full flex flex-col border-0 shadow-none md:border md:shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Property Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {markers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No locations mapped yet.
                  </p>
                ) : (
                  markers.map((marker) => (
                    <Button
                      key={marker.id}
                      variant={activeMarkerId === marker.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => handleItemClick(marker.id)}
                    >
                      <div className="flex flex-col items-start gap-1 text-left w-full">
                        <span className="font-medium">{marker.title}</span>
                        <span className="text-xs opacity-70 font-normal truncate w-full">
                          {marker.description}
                        </span>
                      </div>
                      {activeMarkerId === marker.id && (
                        <Navigation className="ml-auto h-4 w-4 animate-pulse shrink-0" />
                      )}
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Map View */}
        <Card className="w-full md:w-2/3 h-full overflow-hidden border-0 shadow-none md:border md:shadow-sm rounded-lg">
          <InteractiveMap
            className="w-full h-full"
            markers={markers}
            activeMarkerId={activeMarkerId}
            onMarkerClick={handleMarkerClick}
            center={{ lat: 48.61805, lng: -123.0051 }} // Centered on Camp Kitchen area
            zoom={19}
          />
        </Card>
      </div>
    </div>
  );
}
