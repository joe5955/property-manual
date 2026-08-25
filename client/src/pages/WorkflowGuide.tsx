import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  CheckCircle2,
  FileText,
  FolderGit2,
  ImageIcon,
  Lightbulb,
  ListChecks,
  ShieldCheck,
} from "lucide-react";

const captureChecklist = [
  "Photograph the full item or system, then capture identifying labels, controls, connections, and the surrounding location when useful.",
  "Record the building, system, item, and precise location in a field note while the information is fresh.",
  "Use clear, unedited photos. Do not add text overlays, collage layouts, arrows, or composite images.",
  "Name each file with an ordered, descriptive filename, such as 01_dishwasher_bosch_closed.jpg.",
];

const repositoryChecklist = [
  "Place photographs in the appropriate client/public/images/<building>/<category>/ directory.",
  "Keep the numeric sequence intact so related photos retain a sensible order in the manual.",
  "Commit and push the photos with a message that identifies the building or system updated.",
  "Use the repository as the source of truth; do not rely on a temporary upload page or a chat attachment as the archival copy.",
];

const integrationChecklist = [
  "Work from a fresh clone of the repository before integrating a new batch.",
  "Upload approved repository photos to the CDN and retain the resulting file-to-URL mapping.",
  "Add the CDN URLs and clear captions to the matching images array in client/src/data/manual-data.json.",
  "Create a subsection first when the existing section does not describe the equipment or system accurately.",
  "Verify the edited section in the site and confirm that every image, caption, and manual link renders correctly.",
];

export default function WorkflowGuide() {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="gap-2">
          <FolderGit2 className="h-4 w-4" />
          Current operating procedure
        </Badge>
        <h1 className="text-4xl font-serif font-bold text-primary">GitHub Photo Workflow</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A durable, GitHub-first process for keeping the property manual’s photos, captions, and locations accurate.
        </p>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>Single source of truth:</strong> approved source photos live in the <code>joe5955/property-manual</code> repository. The website does not use the retired Photo Upload or Photo Review pages.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              1. Capture and prepare
            </CardTitle>
            <CardDescription>Document the item clearly in the field before any upload occurs.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {captureChecklist.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" />
              2. Archive in GitHub
            </CardTitle>
            <CardDescription>Preserve the clean source files in the repository before publishing them.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {repositoryChecklist.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              3. Integrate and verify
            </CardTitle>
            <CardDescription>Publish only after the source files and manual content are aligned.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {integrationChecklist.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-amber-200 bg-amber-50/60 dark:bg-amber-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <Lightbulb className="h-5 w-5" />
              File and caption standard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-amber-900 dark:text-amber-100">
            <div className="rounded-md border border-amber-200 bg-white/70 p-3 font-mono text-sm dark:bg-amber-950/30 dark:border-amber-700">
              ##_descriptive_name.jpg
            </div>
            <p className="text-sm">
              Use filenames that identify the equipment and view. The website converts filenames into initial captions; refine the caption in the manual when more context is required.
            </p>
            <div className="text-sm">
              <strong>Example:</strong> <code>02_water_heater_serial_label.jpg</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Field-note template
            </CardTitle>
            <CardDescription>Keep this short note with each photo set so an integrator can classify it without guessing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 font-mono text-sm space-y-1">
              <p>Building: Main House</p>
              <p>System: Electrical</p>
              <p>Item: Panel / circuit directory</p>
              <p>Location: Side entry utility room</p>
              <p>Notes: Label and breaker layout photographed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Publication checklist
          </CardTitle>
          <CardDescription>Every batch is complete only when both the repository and the website agree.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Source photos are clean, named, and committed to the correct GitHub folder.",
            "Each image has been mapped to the correct building and subsection in manual-data.json.",
            "CDN URLs load successfully and the live section shows the intended photo order.",
            "Captions identify the item and location without relying on text embedded in the photo.",
            "Any manufacturer manual link remains adjacent to the corresponding appliance or system.",
            "The change has been reviewed, tested, and committed with a clear summary.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
