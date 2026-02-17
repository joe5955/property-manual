import { useState, useEffect } from "react";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import manualData from "@/data/manual-data.json";

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  subsectionId?: string;
  subsectionTitle?: string;
  content: string;
  matchType: "title" | "content";
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [, setLocation] = useLocation();

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Handle search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase();
    const found: SearchResult[] = [];

    manualData.sections.forEach(section => {
      // Check section title
      if (section.title.toLowerCase().includes(searchTerms)) {
        found.push({
          sectionId: section.id,
          sectionTitle: section.title,
          content: section.intro || (section.content ? section.content.substring(0, 100) + "..." : ""),
          matchType: "title"
        });
      }

      // Check subsections
      section.subsections.forEach(sub => {
        const subTitleMatch = sub.title.toLowerCase().includes(searchTerms);
        const contentMatch = sub.content.toLowerCase().includes(searchTerms);
        
        if (subTitleMatch || contentMatch) {
          let snippet = sub.content;
          if (contentMatch) {
            const index = sub.content.toLowerCase().indexOf(searchTerms);
            const start = Math.max(0, index - 40);
            const end = Math.min(sub.content.length, index + 100);
            snippet = (start > 0 ? "..." : "") + sub.content.substring(start, end) + (end < sub.content.length ? "..." : "");
          } else {
            snippet = sub.content.substring(0, 100) + "...";
          }

          found.push({
            sectionId: section.id,
            sectionTitle: section.title,
            subsectionId: sub.id,
            subsectionTitle: sub.title,
            content: snippet,
            matchType: subTitleMatch ? "title" : "content"
          });
        }
      });
    });

    setResults(found);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    if (result.subsectionId) {
      setLocation(`/section/${result.sectionId}#${result.subsectionId}`);
    } else {
      setLocation(`/section/${result.sectionId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground bg-background/50 hover:bg-background/80 border-muted-foreground/20 relative h-9 sm:h-10 sm:pr-12"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline-flex">Search manual...</span>
          <span className="inline-flex sm:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 sm:max-w-[550px] overflow-hidden top-[20%] translate-y-0">
        <div className="flex items-center border-b px-3 h-14">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0"
            placeholder="Type to search (e.g., 'shutoff', 'breaker', 'heater')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent" onClick={() => setQuery("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[300px] overflow-y-auto">
          {results.length === 0 && query.length >= 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
          
          {results.length === 0 && query.length < 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search...
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 mb-1">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 rounded-md px-3 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors group"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {result.subsectionTitle || result.sectionTitle}
                      {result.subsectionTitle && (
                        <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full group-hover:text-accent-foreground group-hover:bg-background/20">
                          in {result.sectionTitle}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-accent-foreground/80">
                    {result.content.replace(/!\[.*?\]\(.*?\)/g, '[Image]')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
