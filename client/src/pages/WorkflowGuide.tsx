import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Camera, List, Mic, AlertTriangle, Lightbulb, FileText } from "lucide-react";

export default function WorkflowGuide() {
  return (
    <div className="container py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Photo Upload Workflow Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Best practices for documenting property items in the field using your Android device
        </p>
      </div>

      {/* Problem Statement */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <AlertTriangle className="h-5 w-5" />
            What Went Wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-amber-900 dark:text-amber-100">
          <p>You uploaded <strong>41 photos</strong> with descriptions recorded in the field, but only <strong>26 were properly labeled</strong>. The 15 unlabeled photos lost their descriptions.</p>
          
          <div className="bg-white dark:bg-amber-950 p-4 rounded-lg border border-amber-300 dark:border-amber-700">
            <h4 className="font-semibold mb-2">Root Cause:</h4>
            <p className="text-sm">When photos are uploaded in batches, descriptions stored in chat messages can get separated from the files during conversation context compression or batch processing.</p>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Options */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary">Choose Your Workflow</h2>

        {/* Option 1: Sequential */}
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-green-600" />
                Option 1: Sequential Upload
              </CardTitle>
              <Badge className="bg-green-600">RECOMMENDED</Badge>
            </div>
            <CardDescription>Best for ensuring every photo gets labeled correctly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Take photo on Android</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium">Immediately upload to Manus chat</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium">Type description in the SAME message</p>
                  <div className="mt-2 p-3 bg-muted rounded-md font-mono text-sm">
                    Main House electrical panel - Entry utility room
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-medium">Wait for AI confirmation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold flex-shrink-0">5</div>
                <div>
                  <p className="font-medium">Move to next photo</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">✅ Pros</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Zero chance of losing descriptions</li>
                  <li>• Photos integrated in real-time</li>
                  <li>• Immediate verification</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-600 mb-1">⚠️ Cons</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Takes more time in field</li>
                  <li>• Requires good cell signal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 2: Batch */}
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-blue-600" />
                Option 2: Batch Upload with Numbered List
              </CardTitle>
              <Badge className="bg-blue-600">FASTER</Badge>
            </div>
            <CardDescription>Best for quick field documentation with many photos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Take all photos on Android</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium">Create a numbered list in your notes app as you go</p>
                  <div className="mt-2 p-3 bg-muted rounded-md font-mono text-sm">
                    Photo 1: Main House panel - Entry utility<br />
                    Photo 2: Main House shutoff - Basement<br />
                    Photo 3: Farm House panel - Dining room
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium">Upload all photos at once to Manus</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-medium">Immediately paste your numbered list</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">✅ Pros</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Faster in the field</li>
                  <li>• Works with poor cell signal</li>
                  <li>• Can review photos before uploading</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-600 mb-1">⚠️ Cons</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Requires careful numbering</li>
                  <li>• Photos must stay in order</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 3: Voice */}
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-purple-600" />
                Option 3: Voice Recording
              </CardTitle>
              <Badge className="bg-purple-600">HANDS-FREE</Badge>
            </div>
            <CardDescription>Best for when you can't type (gloves, ladder, etc.)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Take photo on Android</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium">Use voice recording app to describe</p>
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm italic">
                    "Photo 42: Main House electrical panel, entry utility room, 200 amp service, Square D brand"
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium">Upload photos + voice recording to Manus</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-medium">AI will transcribe and label each photo</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">✅ Pros</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Completely hands-free</li>
                  <li>• Captures more detail</li>
                  <li>• Works in difficult conditions</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-600 mb-1">⚠️ Cons</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Extra step to upload audio</li>
                  <li>• Transcription may have errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description Template */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Description Template
          </CardTitle>
          <CardDescription>Use this format for all photo descriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="font-mono font-semibold text-primary mb-3">[Building] [Item Type] - [Specific Location]</p>
              <div className="space-y-2 text-sm">
                <p className="font-mono">• Main House electrical panel - Entry utility room</p>
                <p className="font-mono">• Farm House water shutoff - Basement northwest corner</p>
                <p className="font-mono">• Chalet propane stove - Kitchen</p>
                <p className="font-mono">• Camp Kitchen generator - Behind shelter</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <strong className="block mb-1">Pro Tip:</strong>
            Include building name + item type + location in every description for easy searching later.
          </AlertDescription>
        </Alert>

        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            <strong className="block mb-1">Important:</strong>
            Always request a checkpoint after uploading photos to permanently lock in your work.
          </AlertDescription>
        </Alert>
      </div>

      {/* System Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            System Improvements Implemented
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Photo Metadata Preservation</p>
                <p className="text-sm text-muted-foreground">All photo descriptions are now saved to a backup file that persists even if conversation context is compressed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Confirmation Protocol</p>
                <p className="text-sm text-muted-foreground">After each photo upload, you'll receive immediate confirmation with the description and location it was added to.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Photo Review Page</p>
                <p className="text-sm text-muted-foreground">Enhanced page shows all uploaded photos with their status, making it easy to identify unlabeled ones.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">Your Action Items Going Forward</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-900 dark:text-green-100">
          <div>
            <h4 className="font-semibold mb-2">Before Field Work:</h4>
            <ul className="space-y-1 text-sm ml-4">
              <li>✅ Choose your preferred workflow (Sequential, Batch, or Voice)</li>
              <li>✅ If using Batch: Open notes app for numbering</li>
              <li>✅ If using Voice: Test voice recorder app</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">During Field Work:</h4>
            <ul className="space-y-1 text-sm ml-4">
              <li>✅ Follow chosen workflow consistently</li>
              <li>✅ Include location + description for each photo</li>
              <li>✅ Number photos if using Batch method</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">After Field Work:</h4>
            <ul className="space-y-1 text-sm ml-4">
              <li>✅ Upload photos + descriptions to Manus</li>
              <li>✅ Wait for confirmation of each photo</li>
              <li>✅ Review the Photo Review page to verify all are labeled</li>
              <li>✅ Request a checkpoint to lock in the work</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
