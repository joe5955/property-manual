import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wifi, Copy, CheckCircle2, AlertCircle, Trash2, Key, Thermometer, Lock } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

export default function GuestGuide() {
  const [copied, setCopied] = useState(false);

  const copyWifi = () => {
    navigator.clipboard.writeText("SanJuanGuest");
    setCopied(true);
    toast.success("Wi-Fi password copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">Welcome to the Estate</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We hope you enjoy your stay. Here is everything you need to know to settle in comfortably.
          </p>
        </div>

        {/* Wi-Fi Card - Prominent */}
        <Card className="border-primary/20 shadow-lg bg-primary/5">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif">Wi-Fi Access</h2>
                <p className="text-muted-foreground">Connect to high-speed internet</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="bg-background border rounded-lg px-4 py-2 flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Network</span>
                <span className="font-mono font-medium">SanJuanGuest</span>
              </div>
              <div className="bg-background border rounded-lg px-4 py-2 flex flex-col relative group">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Password</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">IslandLife2026</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary" 
                    onClick={copyWifi}
                  >
                    {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* House Rules - Simple & Visual */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" /> House Guide
            </h2>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚭</span>
                  </div>
                  <div>
                    <h3 className="font-medium">No Smoking</h3>
                    <p className="text-sm text-muted-foreground">Strictly no smoking inside any buildings.</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🐶</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Pet Policy</h3>
                    <p className="text-sm text-muted-foreground">Pets welcome. Please keep on leash near livestock areas.</p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤫</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Quiet Hours</h3>
                    <p className="text-sm text-muted-foreground">10:00 PM - 8:00 AM. Sound carries over the water.</p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Trash & Recycling</h3>
                    <p className="text-sm text-muted-foreground">Bins are located in the shed. Please secure lids tightly (raccoons!).</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Check-Out Checklist - Interactive feel */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <Key className="h-6 w-6 text-primary" /> Departure Checklist
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Before You Leave</CardTitle>
                <CardDescription>A quick check to keep the property safe.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="mt-0.5 h-5 w-5 rounded border border-primary/50 flex items-center justify-center group-hover:border-primary">
                    <div className="h-3 w-3 rounded-sm bg-primary/0 group-hover:bg-primary/20 transition-colors"></div>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" /> Heat
                    </h4>
                    <p className="text-sm text-muted-foreground">Please set thermostats to 55°F.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="mt-0.5 h-5 w-5 rounded border border-primary/50 flex items-center justify-center group-hover:border-primary">
                    <div className="h-3 w-3 rounded-sm bg-primary/0 group-hover:bg-primary/20 transition-colors"></div>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" /> Security
                    </h4>
                    <p className="text-sm text-muted-foreground">Lock all windows and exterior doors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="mt-0.5 h-5 w-5 rounded border border-primary/50 flex items-center justify-center group-hover:border-primary">
                    <div className="h-3 w-3 rounded-sm bg-primary/0 group-hover:bg-primary/20 transition-colors"></div>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Lights
                    </h4>
                    <p className="text-sm text-muted-foreground">Turn off all interior and exterior lights.</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-sm font-medium text-primary">Safe travels! We hope to see you again soon.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
