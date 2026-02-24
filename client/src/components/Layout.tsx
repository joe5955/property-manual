import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight, Home, Map, FileText, Wrench, Shield, Droplet, Zap, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import manualData from "@/data/manual-data.json";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Map icons to section IDs for visual enhancement
  const getIconForSection = (id: string) => {
    if (id.includes("overview")) return <Home className="h-4 w-4" />;
    if (id.includes("map") || id.includes("location")) return <Map className="h-4 w-4" />;
    if (id.includes("legal") || id.includes("deed")) return <FileText className="h-4 w-4" />;
    if (id.includes("maintenance") || id.includes("repair")) return <Wrench className="h-4 w-4" />;
    if (id.includes("security") || id.includes("access")) return <Shield className="h-4 w-4" />;
    if (id.includes("water") || id.includes("plumbing")) return <Droplet className="h-4 w-4" />;
    if (id.includes("electric") || id.includes("power")) return <Zap className="h-4 w-4" />;
    if (id.includes("dock") || id.includes("marine")) return <Anchor className="h-4 w-4" />;
    return <ChevronRight className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Mobile Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 lg:hidden transition-all duration-300",
          scrolled ? "bg-background/95 backdrop-blur-sm border-b shadow-sm" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">
            S
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-primary">San Juan Estate</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle Menu">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-sidebar-border/50">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-primary/90">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg tracking-tight text-sidebar-foreground leading-none group-hover:text-primary transition-colors">San Juan Estate</span>
                  <span className="text-xs text-muted-foreground mt-1 font-medium tracking-wide uppercase">Property Manual</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-4 space-y-1">
              <Link href="/">
                <div 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group cursor-pointer",
                    location === "/" 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Home className={cn("h-4 w-4 transition-colors", location === "/" ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                  <span>Dashboard</span>
                </div>
              </Link>

              <div className="my-4 px-3">
                <h3 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">Property Sections</h3>
                <div className="space-y-1">
                  {manualData.sections.map((section) => (
                    <Link key={section.id} href={`/section/${section.id}`}>
                      <div 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group cursor-pointer",
                          location === `/section/${section.id}` 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <span className={cn("transition-colors", location === `/section/${section.id}` ? "text-primary" : "text-muted-foreground group-hover:text-primary")}>
                          {getIconForSection(section.id)}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold border border-border">
                SC
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-sidebar-foreground">Shady Cove LLC</span>
                <span className="text-[10px] text-muted-foreground">Owner</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        className={cn(
          "lg:pl-72 min-h-screen transition-all duration-300",
          "pt-16 lg:pt-0" // Add padding for mobile header
        )}
      >
        <div className="container max-w-5xl mx-auto p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="py-8 border-t border-border/40 mt-auto">
          <div className="container max-w-5xl mx-auto px-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} San Juan County Estate Property Manual. Confidential Document.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
