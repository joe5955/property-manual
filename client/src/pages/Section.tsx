import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, FileText, MapPin, Home, Wrench, Shield, Droplet, Zap, Anchor } from "lucide-react";
import { Streamdown } from "streamdown";
import manualData from "@/data/manual-data.json";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";

export default function Section() {
  const [match, params] = useRoute("/section/:id");
  
  if (!match || !params) return <NotFound />;

  const sectionId = params.id;
  const section = manualData.sections.find(s => s.id === sectionId);

  if (!section) return <NotFound />;

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
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
            {section.subsections.map((subsection, idx) => (
              <Card key={idx} className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
                  <CardTitle className="font-serif text-xl text-primary">{subsection.title}</CardTitle>
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
                </CardContent>
              </Card>
            ))}

            {/* Fallback if no subsections */}
            {section.subsections.length === 0 && section.content && !section.intro && (
              <Card>
                <CardContent className="p-6 prose prose-stone dark:prose-invert max-w-none">
                  <Streamdown>{section.content}</Streamdown>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar / Table of Contents */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-muted/30 border-none shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">On This Page</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-6 pb-6">
                  <nav className="flex flex-col space-y-1">
                    {section.subsections.map((sub, idx) => (
                      <a 
                        key={idx} 
                        href={`#${sub.id}`} 
                        className="text-sm text-muted-foreground hover:text-primary py-1.5 border-l-2 border-transparent hover:border-primary pl-3 transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real implementation, we'd add IDs to the subsection cards
                          // For now, just a visual link
                        }}
                      >
                        {sub.title}
                      </a>
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
