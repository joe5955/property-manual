import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, ChevronDown, FileText, MapPin, Home, Wrench, Shield, Droplet, Zap, Anchor, AlertTriangle, List } from "lucide-react";
import RequestQuoteButton from "@/components/RequestQuoteButton";
import { Streamdown } from "streamdown";
import manualData from "@/data/manual-data.json";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";

// Define types for the manual data structure
interface ManualImage {
  url: string;
  caption?: string;
}

interface ManualItem {
  title: string;
  content: string;
}

interface ManualSubsection {
  id: string;
  title: string;
  content: string;
  intro?: string;
  items?: ManualItem[];
  images?: ManualImage[];
}

interface ManualSection {
  id: string;
  title: string;
  content: string;
  intro?: string;
  subsections: ManualSubsection[];
  images?: ManualImage[];
}

export default function Section() {
  const [match, params] = useRoute("/section/:id");
  const [tocOpen, setTocOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const subsectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  if (!match || !params) return <NotFound />;

  const sectionId = params.id;
  const section = manualData.sections.find(s => s.id === sectionId) as ManualSection | undefined;

  if (!section) return <NotFound />;

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setTocOpen(false);
    setImgErrors({});
  }, [sectionId]);

  // Helper to get icon for section
  const getSectionIcon = (id: string) => {
    if (id.includes("overview")) return <Home className="h-6 w-6" />;
    if (id.includes("map") || id.includes("location")) return <MapPin className="h-6 w-6" />;
    if (id.includes("legal") || id.includes("deed")) return <FileText className="h-6 w-6" />;
    if (id.includes("maintenance") || id.includes("repair")) return <Wrench className="h-6 w-6" />;
    if (id.includes("security") || id.includes("access")) return <Shield className="h-6 w-6" />;
    if (id.includes("water") || id.includes("plumbing")) return <Droplet className="h-6 w-6" />;
    if (id.includes("electric") || id.includes("power")) return <Zap className="h-6 w-6" />;
    if (id.includes("dock") || id.includes("marine")) return <Anchor className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const scrollToSubsection = (subId: string) => {
    const el = subsectionRefs.current[subId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  const handleImgError = (url: string) => {
    setImgErrors(prev => ({ ...prev, [url]: true }));
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{section.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {getSectionIcon(section.id)}
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">{section.title}</h1>
              <p className="text-muted-foreground mt-1">Property Manual Section</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Mobile Table of Contents - visible on small screens */}
        {section.subsections.length > 0 && (
          <div className="lg:hidden">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 rounded-lg border border-border/60 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <List className="h-4 w-4 text-primary" />
                <span>Sections in this page ({section.subsections.length})</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${tocOpen ? 'rotate-180' : ''}`} />
            </button>
            {tocOpen && (
              <div className="mt-2 bg-card rounded-lg border border-border/60 shadow-sm overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <nav className="flex flex-col py-1">
                  {section.subsections.map((sub, idx) => (
                    <button 
                      key={idx} 
                      className="text-left text-sm text-muted-foreground hover:text-primary hover:bg-muted/30 py-2.5 px-4 border-l-2 border-transparent hover:border-primary transition-all duration-200"
                      onClick={() => scrollToSubsection(sub.id)}
                    >
                      {sub.title}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Intro Content */}
            {section.intro && (
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 prose prose-stone dark:prose-invert max-w-none">
                  <Streamdown>{section.intro}</Streamdown>
                </CardContent>
              </Card>
            )}

            {/* Subsections */}
            {section.subsections.map((subsection, idx) => {
              // Check if this is a critical alert section to add the quote button
              const isCriticalWaterHeater = subsection.title.toLowerCase().includes("critical") && 
                                          subsection.title.toLowerCase().includes("water heater");
              
              // Extract details based on section ID
              let quoteDetails = null;
              if (isCriticalWaterHeater) {
                if (section.id === "farm-house") {
                  quoteDetails = {
                    buildingName: "Farm House",
                    applianceName: "Water Heater",
                    modelNumber: "Bradford White MI50S6DS21",
                    serialNumber: "ZB2783563",
                    age: "25 years (Feb 2001)",
                    notes: "50 Gallon. CRITICAL FAILURE RISK."
                  };
                } else if (section.id === "lighthouse-point-beach-house") {
                  quoteDetails = {
                    buildingName: "Lighthouse Point Beach House",
                    applianceName: "Water Heater",
                    modelNumber: "Bradford White",
                    serialNumber: "Unknown",
                    age: "22 years (2004)",
                    notes: "CRITICAL FAILURE RISK. Exceeds 8-12 year lifespan."
                  };
                }
              }

              return (
                <div
                  key={idx}
                  ref={(el) => { subsectionRefs.current[subsection.id] = el; }}
                  id={subsection.id}
                  className="scroll-mt-20"
                >
                  <Card className={`overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 ${isCriticalWaterHeater ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                    <CardHeader className={`bg-muted/30 border-b border-border/40 pb-4 ${isCriticalWaterHeater ? 'bg-red-100/50 dark:bg-red-900/20' : ''}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className={`font-serif text-xl ${isCriticalWaterHeater ? 'text-red-700 dark:text-red-400 flex items-center gap-2' : 'text-primary'}`}>
                          {isCriticalWaterHeater && <AlertTriangle className="h-5 w-5" />}
                          {subsection.title}
                        </CardTitle>
                        {isCriticalWaterHeater && quoteDetails && (
                          <RequestQuoteButton {...quoteDetails} />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                    {subsection.intro && (
                      <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed">
                        <Streamdown>{subsection.intro}</Streamdown>
                      </div>
                    )}
                    
                    {subsection.items && subsection.items.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {subsection.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="bg-background rounded-lg p-4 border border-border/60 hover:border-primary/30 transition-colors">
                            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-secondary"></div>
                              {item.title}
                            </h4>
                            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <Streamdown>{item.content}</Streamdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* If no items but content exists */}
                    {(!subsection.items || subsection.items.length === 0) && subsection.content && !subsection.intro && (
                      <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed">
                        <Streamdown>{subsection.content}</Streamdown>
                      </div>
                    )}

                    {/* Photo Gallery - mobile-optimized */}
                    {subsection.images && subsection.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Photos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {subsection.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="rounded-lg overflow-hidden border border-border/60 bg-muted/20">
                              {!imgErrors[img.url] ? (
                                <a href={img.url} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={img.url}
                                    alt={img.caption || subsection.title}
                                    className="w-full h-auto min-h-[120px] max-h-[400px] object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
                                    loading="lazy"
                                    decoding="async"
                                    onError={() => handleImgError(img.url)}
                                  />
                                </a>
                              ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-muted/40 text-muted-foreground text-sm">
                                  <span>Image unavailable</span>
                                </div>
                              )}
                              {img.caption && (
                                <p className="text-xs text-muted-foreground px-3 py-2 leading-snug">{img.caption}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </div>
              );
            })}

            {/* Fallback if no subsections */}
            {section.subsections.length === 0 && section.content && !section.intro && (
              <Card>
                <CardContent className="p-6 prose prose-stone dark:prose-invert max-w-none">
                  <Streamdown>{section.content}</Streamdown>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar / Table of Contents - desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-muted/30 border-none shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">On This Page</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-6 pb-6">
                  <nav className="flex flex-col space-y-1">
                    {section.subsections.map((sub, idx) => (
                      <button 
                        key={idx} 
                        className="text-left text-sm text-muted-foreground hover:text-primary py-1.5 border-l-2 border-transparent hover:border-primary pl-3 transition-all duration-200"
                        onClick={() => scrollToSubsection(sub.id)}
                      >
                        {sub.title}
                      </button>
                    ))}
                    {section.subsections.length === 0 && (
                      <span className="text-sm text-muted-foreground italic pl-3">No subsections</span>
                    )}
                  </nav>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4">
                  <h4 className="font-serif font-bold text-primary mb-2">Need Updates?</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Information in this manual should be verified periodically. Last updated: {(manualData.metadata as any).updated || "Feb 2026"}
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    Request Update
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
