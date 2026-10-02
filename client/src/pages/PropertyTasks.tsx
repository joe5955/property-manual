import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Clock3, ClipboardList, MapPin, Pencil, Plus, X } from "lucide-react";

const locations = [
  "Property-wide", "Main House", "The Chalet", "Camp Kitchen", "Picnic Shelter",
  "Beach House", "Farm House", "Caretaker House", "Madrona House", "Boat House",
  "Main Shop", "Lower Shop", "Upper Shop", "Tractor Shed", "Pump Shed",
  "Pump House", "Root Cellar", "Well System", "Windmill Well", "Water Storage",
  "Utility Buildings", "Generator Shed", "Fire Suppression", "Pond / Lagoon",
  "Indian Point", "Multiple Buildings", "Undetermined",
];
const statusLabels = { todo: "To do", in_progress: "In progress", done: "Complete" } as const;
type Status = keyof typeof statusLabels;

function todayLocal() {
  const now = new Date();
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
function formatMinutes(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export default function PropertyTasks() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data, isLoading, error } = trpc.propertyTasks.list.useQuery(undefined, { enabled: isAdmin });
  const createTask = trpc.propertyTasks.create.useMutation();
  const updateTask = trpc.propertyTasks.update.useMutation();
  const addTime = trpc.propertyTasks.addTime.useMutation();
  const deleteTime = trpc.propertyTasks.deleteTime.useMutation();
  const tasks = data?.tasks ?? [];
  const entries = data?.timeEntries ?? [];
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Property-wide");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [loggingTaskId, setLoggingTaskId] = useState<number | null>(null);
  const [workedDate, setWorkedDate] = useState(todayLocal());
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [timeNote, setTimeNote] = useState("");

  const refresh = () => utils.propertyTasks.list.invalidate();
  const resetForm = () => {
    setEditingId(null); setShowForm(false); setTitle(""); setLocation("Property-wide");
    setDescription(""); setSuggestions(""); setSourceNote("");
  };
  const beginEdit = (task: (typeof tasks)[number]) => {
    setEditingId(task.id); setTitle(task.title); setLocation(task.location);
    setDescription(task.description ?? ""); setSuggestions(task.suggestions ?? "");
    setSourceNote(task.sourceNote ?? ""); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const saveTask = async () => {
    if (!title.trim() || !location.trim()) return toast({ title: "Enter a task title and location", variant: "destructive" });
    const payload = {
      title: title.trim(), location: location.trim(), description: description.trim(),
      suggestions: suggestions.trim(), sourceNote: sourceNote.trim(),
    };
    try {
      if (editingId) await updateTask.mutateAsync({ id: editingId, ...payload });
      else await createTask.mutateAsync(payload);
      await refresh(); resetForm();
      toast({ title: editingId ? "Task updated" : "Task added" });
    } catch (cause) {
      toast({ title: "Could not save task", description: String(cause), variant: "destructive" });
    }
  };
  const setStatus = async (id: number, status: Status) => {
    try {
      await updateTask.mutateAsync({ id, status });
      await refresh();
      toast({ title: status === "done" ? "Task marked complete" : "Task status updated" });
    } catch (cause) {
      toast({ title: "Could not update status", description: String(cause), variant: "destructive" });
    }
  };
  const logTime = async (taskId: number) => {
    const h = Number(hours);
    const m = Number(minutes);
    const total = h * 60 + m;
    const workedAt = new Date(`${workedDate}T12:00:00`).getTime();
    if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || m < 0 || m >= 60 || total < 1 || total > 1440 || !Number.isFinite(workedAt)) {
      return toast({ title: "Enter a valid work date and duration (up to 24 hours)", variant: "destructive" });
    }
    try {
      await addTime.mutateAsync({ taskId, workedAt, minutes: total, note: timeNote.trim() });
      await refresh(); setLoggingTaskId(null); setHours("0"); setMinutes("0"); setTimeNote("");
      toast({ title: "Actual work time recorded" });
    } catch (cause) {
      toast({ title: "Could not log time", description: String(cause), variant: "destructive" });
    }
  };
  const removeTime = async (id: number) => {
    if (!confirm("Remove this time entry?")) return;
    try { await deleteTime.mutateAsync({ id }); await refresh(); }
    catch (cause) { toast({ title: "Could not remove time", description: String(cause), variant: "destructive" }); }
  };

  if (authLoading) return <p className="py-10 text-muted-foreground">Checking owner access…</p>;
  if (!isAdmin) return (
    <div className="max-w-xl space-y-3 py-12">
      <h1 className="text-3xl font-serif font-bold">Property Tasks</h1>
      <p className="text-muted-foreground">Tasks, work time, and private field-note references are available only to the property owner. Sign in as an owner to view them.</p>
      {!user && <Button onClick={() => { window.location.href = getLoginUrl(); }}>Sign in as owner</Button>}
    </div>
  );

  const locationChoices = Array.from(new Set([...locations, ...tasks.map((task) => task.location)])).sort();
  const visible = tasks.filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterLocation && task.location !== filterLocation) return false;
    const q = search.toLowerCase().trim();
    return !q || [task.title, task.location, task.description, task.suggestions].some((value) => value?.toLowerCase().includes(q));
  }).sort((a, b) => {
    const order = { in_progress: 0, todo: 1, done: 2 };
    return order[a.status] - order[b.status] || a.location.localeCompare(b.location) || b.id - a.id;
  });
  const totalMinutes = entries.reduce((sum, entry) => sum + entry.minutes, 0);

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Badge variant="outline">Owner-only work ledger</Badge>
        <h1 className="mt-3 text-3xl font-serif font-bold">Property Tasks</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Track what needs doing, actual time spent, and when work is completed. Historical completed improvements stay in <Link href="/work-history" className="underline">Work History</Link>; this is the live task list.</p>
      </div>
      <Button className="gap-2" onClick={() => showForm ? resetForm() : setShowForm(true)}>
        {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{showForm ? "Cancel" : "Add task"}
      </Button>
    </div>

    <details className="rounded-xl border bg-card p-4 text-sm">
      <summary className="cursor-pointer font-semibold">Using Fieldy on a property walk</summary>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
        <li>Start a new Fieldy transcription for the property walk. Say the building, task, who did the work, date, actual start/end times or elapsed work hours, completion state, and any recommended follow-up.</li>
        <li>End the recording, let it sync, and review its transcript. Fieldy’s recording duration is <strong>not</strong> the hours worked.</li>
        <li>Copy a short, confirmed summary into a task here (or send the exported note to Manus to organize). Enter work time explicitly and mark complete only when you confirm the job is done.</li>
      </ol>
      <p className="mt-3 text-muted-foreground">Suggested spoken format: “Property log. Location: Pump House. Task: replace filter. Worked 9:15 to 10:00, forty-five minutes. Status: complete. Follow-up: check pressure next week.”</p>
    </details>

    {showForm && <Card className="border-primary/30"><CardHeader><CardTitle>{editingId ? "Edit task" : "New task"}</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2"><label htmlFor="task-title" className="text-sm font-medium">Task *</label><Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} placeholder="e.g. Check Pump House pressure" /></div>
        <div className="space-y-1"><label htmlFor="task-location" className="text-sm font-medium">Location *</label><Input id="task-location" list="task-location-choices" maxLength={160} value={location} onChange={(e) => setLocation(e.target.value)} /><datalist id="task-location-choices">{locationChoices.map((choice) => <option key={choice} value={choice} />)}</datalist></div>
        <div className="space-y-1 sm:col-span-2"><label htmlFor="task-description" className="text-sm font-medium">What needs doing</label><Textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={3000} /></div>
        <div className="space-y-1"><label htmlFor="task-suggestions" className="text-sm font-medium">Suggestions / follow-up</label><Textarea id="task-suggestions" value={suggestions} onChange={(e) => setSuggestions(e.target.value)} maxLength={2000} placeholder="Ideas to review, not automatic tasks" /></div>
        <div className="space-y-1"><label htmlFor="task-source" className="text-sm font-medium">Fieldy note reference (optional)</label><Textarea id="task-source" value={sourceNote} onChange={(e) => setSourceNote(e.target.value)} maxLength={500} placeholder="Date and conversation title; avoid pasting private transcripts" /></div>
        <div className="flex gap-2 sm:col-span-2"><Button onClick={saveTask} disabled={createTask.isPending || updateTask.isPending}>Save task</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
      </CardContent>
    </Card>}

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        ["To do", tasks.filter((task) => task.status === "todo").length],
        ["In progress", tasks.filter((task) => task.status === "in_progress").length],
        ["Completed", tasks.filter((task) => task.status === "done").length],
        ["Actual time logged", formatMinutes(totalMinutes)],
      ].map(([label, value]) => <Card key={label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-serif font-bold">{value}</p></CardContent></Card>)}
    </div>
    <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-3">
      <select aria-label="Status filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <select aria-label="Location filter" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="h-10 max-w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">All locations</option>{locationChoices.map((choice) => <option key={choice}>{choice}</option>)}</select>
      <Input aria-label="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" className="h-10 min-w-44 flex-1" />
    </div>
    {isLoading ? <p className="py-10 text-muted-foreground">Loading tasks…</p> : error ? <p className="py-10 text-destructive">Could not load tasks. Please refresh and try again.</p> : visible.length === 0 ? (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground"><ClipboardList className="mx-auto mb-3 h-9 w-9" />{tasks.length ? "No tasks match these filters." : "No tasks yet. Add the first property job above."}</div>
    ) : <div className="space-y-4">{visible.map((task) => {
      const work = entries.filter((entry) => entry.taskId === task.id);
      const sum = work.reduce((total, entry) => total + entry.minutes, 0);
      return <Card key={task.id}><CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2"><Badge variant={task.status === "done" ? "secondary" : "outline"}>{statusLabels[task.status]}</Badge><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{task.location}</span></div>
          <h2 className="text-xl font-serif font-semibold">{task.title}</h2>
          {task.description && <p className="whitespace-pre-line text-sm text-muted-foreground">{task.description}</p>}
        </div><Button variant="ghost" size="sm" className="gap-1" onClick={() => beginEdit(task)}><Pencil className="h-4 w-4" />Edit</Button></div>
        {task.suggestions && <p className="rounded-md bg-muted/60 p-3 text-sm"><strong>Suggestions:</strong> {task.suggestions}</p>}
        {task.sourceNote && <p className="text-xs text-muted-foreground"><strong>Fieldy reference:</strong> {task.sourceNote}</p>}
        <div className="flex flex-wrap items-center gap-3 border-t pt-3 text-sm">
          <span className="inline-flex items-center gap-1 font-medium"><Clock3 className="h-4 w-4" />{formatMinutes(sum)} worked</span>
          {task.completedAt && <span className="inline-flex items-center gap-1 text-muted-foreground"><CheckCircle2 className="h-4 w-4" />Completed {new Date(task.completedAt).toLocaleDateString()}</span>}
        </div>
        {work.length > 0 && <details className="text-xs text-muted-foreground"><summary className="cursor-pointer">View {work.length} time {work.length === 1 ? "entry" : "entries"}</summary><ul className="mt-2 space-y-2">{work.map((entry) => <li key={entry.id} className="flex flex-wrap items-center gap-2"><span>{new Date(entry.workedAt).toLocaleDateString()} · {formatMinutes(entry.minutes)}{entry.note ? ` — ${entry.note}` : ""}</span><button type="button" onClick={() => removeTime(entry.id)} className="underline hover:text-destructive">Remove</button></li>)}</ul></details>}
        <div className="flex flex-wrap gap-2">
          {task.status !== "in_progress" && <Button size="sm" variant="outline" onClick={() => setStatus(task.id, "in_progress")} disabled={updateTask.isPending}>Start / resume</Button>}
          {task.status !== "done" && <Button size="sm" variant="outline" onClick={() => setStatus(task.id, "done")} disabled={updateTask.isPending}>Mark complete</Button>}
          {task.status === "in_progress" && <Button size="sm" variant="outline" onClick={() => setStatus(task.id, "todo")} disabled={updateTask.isPending}>Move to do</Button>}
          <Button size="sm" variant="secondary" onClick={() => { setLoggingTaskId(loggingTaskId === task.id ? null : task.id); setWorkedDate(todayLocal()); }}>{loggingTaskId === task.id ? "Cancel time" : "Log work time"}</Button>
        </div>
        {loggingTaskId === task.id && <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
          <div className="space-y-1"><label htmlFor={`worked-${task.id}`} className="text-xs font-medium">Work date</label><Input id={`worked-${task.id}`} type="date" value={workedDate} onChange={(e) => setWorkedDate(e.target.value)} /></div>
          <div className="space-y-1"><label htmlFor={`hours-${task.id}`} className="text-xs font-medium">Hours</label><Input id={`hours-${task.id}`} type="number" min="0" max="24" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
          <div className="space-y-1"><label htmlFor={`minutes-${task.id}`} className="text-xs font-medium">Minutes</label><Input id={`minutes-${task.id}`} type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></div>
          <div className="space-y-1 sm:col-span-3"><label htmlFor={`note-${task.id}`} className="text-xs font-medium">Work performed (optional)</label><Input id={`note-${task.id}`} value={timeNote} maxLength={500} onChange={(e) => setTimeNote(e.target.value)} placeholder="What was done during this time?" /></div>
          <Button className="sm:col-span-3" disabled={addTime.isPending} onClick={() => logTime(task.id)}>Save actual time</Button>
        </div>}
      </CardContent></Card>;
    })}</div>}
    <p className="text-xs text-muted-foreground">Time is entered by you, never inferred from Fieldy recording duration. Completion changes only when you mark a task done.</p>
  </div>;
}
