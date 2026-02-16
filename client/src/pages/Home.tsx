import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, MapPin, Home as HomeIcon, FileText, Calendar, AlertCircle, CheckCircle2, Clock, Ship, Phone, Navigation, Wrench } from "lucide-react";
import manualData from "@/data/manual-data.json";
import Layout from "@/components/Layout";

export default function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Extract key metrics from manual data
  const totalAcreage = "156.61";
  const parcelCount = "7";
  const structureCount = "6";
  const lastUpdated = (manualData.metadata as any).updated || "February 12, 2026";

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-xl">
          <div className="absolute inset-0 bg-[url('/hero-estate-aerial.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <Badge variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm px-3 py-1">
                Property Manual v2.0
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {greeting}, Ned and Haleh.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 font-light max-w-lg leading-relaxed">
                Welcome to the digital archive for your San Juan County estate. Access comprehensive documentation, maintenance records, and property details.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button variant="secondary" size="lg" className="font-medium shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/section/farm-house">
                    Explore Property <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm" asChild>
                  <Link href="/section/main-house">
                    View Utilities <Wrench className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Quick Stats Card */}
            <Card className="w-full md:w-80 bg-background/95 backdrop-blur-md border-none shadow-2xl transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Estate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Acreage</span>
                  </div>
                  <span className="font-serif font-bold text-lg">{totalAcreage} ac</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Parcels</span>
                  </div>
                  <span className="font-serif font-bold text-lg">{parcelCount}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Structures</span>
                  </div>
                  <span className="font-serif font-bold text-lg">{structureCount}</span>
                </div>
                <div className="pt-2 text-xs text-muted-foreground text-center bg-muted/30 py-2 rounded-md mt-2">
                  Last Updated: {lastUpdated}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Arrival & Access Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <Navigation className="h-6 w-6 text-primary" /> Arrival & Access
            </h2>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Getting Here</CardTitle>
                <CardDescription>Ferry reservations and driving directions</CardDescription>
                <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/10">
                  <h4 className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Property Address
                  </h4>
                  <p className="text-base font-serif font-medium">667 Bear Cove Rd, Deer Harbor, WA 98243</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-primary">
                    <Ship className="h-4 w-4" /> Washington State Ferries
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Reservations are highly recommended for travel to/from Orcas Island.
                  </p>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="https://secureapps.wsdot.wa.gov/ferries/reservations/vehicle/default.aspx" target="_blank" rel="noopener noreferrer">
                      Make a Reservation <ArrowRight className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-primary">
                    <MapPin className="h-4 w-4" /> Driving Directions
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2 pl-2 border-l-2 border-muted">
                    <p>From Orcas Island Ferry Terminal (approx. 18 min):</p>
                    <ol className="list-decimal list-inside space-y-1 ml-1">
                      <li>Exit the ferry ramp and take an <strong>immediate left</strong> onto <strong>Orcas Rd</strong></li>
                      <li>Continue on <strong>Orcas Rd</strong> (2.5 mi)</li>
                      <li>Turn left onto <strong>Deer Harbor Rd</strong> (5.3 mi)</li>
                      <li>Turn left onto <strong>Bear Cove Rd</strong> (0.4 mi)</li>
                    </ol>
                    <p className="text-xs italic mt-2">Destination will be on the left.</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="https://www.google.com/maps/dir/Orcas+Island+Ferry+Terminal,+Orcas+Road,+Orcas,+WA/Bear+Cove+Rd,+Eastsound,+WA+98245/" target="_blank" rel="noopener noreferrer">
                      Open in Google Maps <ArrowRight className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <Phone className="h-6 w-6 text-primary" /> Caretaker Contacts
            </h2>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Immediate Assistance</CardTitle>
                <CardDescription>Contact Joseph or Lilliana for any questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">JW</div>
                    <div>
                      <h4 className="font-medium">Joseph Wolford</h4>
                      <p className="text-sm text-muted-foreground">Caretaker</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="tel:3609829705" className="font-mono">360-982-9705</a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">LV</div>
                    <div>
                      <h4 className="font-medium">Lilliana Villalobos</h4>
                      <p className="text-sm text-muted-foreground">Caretaker</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="tel:3603176121" className="font-mono">360-317-6121</a>
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-200 text-sm rounded-md flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>For medical or fire emergencies, always dial <strong>911</strong> first. The property address is <strong>667 Bear Cove Rd, Deer Harbor, WA 98243</strong>.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Quick Access</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/guest-guide">Guest Guide <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buildings Card */}
            <Link href="/section/farm-house">
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="h-32 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/hero-buildings.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white font-serif font-bold text-lg">Buildings & Structures</div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    Detailed documentation for Main House, Chalet, Caretaker's House, and other structures.
                  </p>
                  <div className="flex items-center text-xs font-medium text-primary group-hover:translate-x-1 transition-transform duration-300">
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Utilities Card */}
            <Link href="/section/lighthouse-point-beach-house">
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="h-32 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/hero-utilities.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white font-serif font-bold text-lg">Utilities & Systems</div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    Electrical, water, septic, and heating systems documentation and maps.
                  </p>
                  <div className="flex items-center text-xs font-medium text-primary group-hover:translate-x-1 transition-transform duration-300">
                    View Systems <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Land Management Card */}
            <Link href="/section/farm-house">
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="h-32 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/hero-land-management.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white font-serif font-bold text-lg">Land Management</div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    Forestry plans, conservation easements, and landscape maintenance schedules.
                  </p>
                  <div className="flex items-center text-xs font-medium text-primary group-hover:translate-x-1 transition-transform duration-300">
                    View Plans <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Recent Updates & Maintenance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-foreground">Recent Documentation</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="divide-y divide-border">
                    {[
                      { title: "The Chalet - Water Heater", date: "Feb 13, 2026", type: "Appliance", status: "Documented" },
                      { title: "The Chalet - Refrigerator", date: "Feb 13, 2026", type: "Appliance", status: "Documented" },
                      { title: "The Chalet - Gas Fireplace", date: "Feb 13, 2026", type: "Heating", status: "Documented" },
                      { title: "Generator System", date: "Feb 13, 2026", type: "Utility", status: "Documented" },
                      { title: "Camp Kitchen - Appliances", date: "Feb 13, 2026", type: "Appliance", status: "Documented" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                          <div>
                            <h4 className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.type} • {item.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-normal bg-secondary/50 text-secondary-foreground">
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Maintenance Status</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-serif">System Health</CardTitle>
                <CardDescription>Current status of critical systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">Generator</span>
                  </div>
                  <Badge variant="outline" className="bg-white dark:bg-black border-green-200 text-green-700">Ready</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Picnic Shelter Roof</span>
                  </div>
                  <Badge variant="outline" className="bg-white dark:bg-black border-amber-200 text-amber-700">Needs Cleaning</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">Water System</span>
                  </div>
                  <Badge variant="outline" className="bg-white dark:bg-black border-green-200 text-green-700">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
