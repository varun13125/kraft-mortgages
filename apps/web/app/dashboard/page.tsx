"use client";
import { useEffect, useState } from "react";
import { apiPost, apiGet } from "@/lib/api";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebase.client";
import Link from "next/link";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  FileText, 
  BarChart3,
  LogOut,
  Bot,
  Zap,
  AlertCircle
} from "lucide-react";

type Run = {
  id: string; 
  mode: string; 
  manualQuery?: string; 
  steps: any[]; 
  published?: { url?: string };
  startedAt: string;
  createdBy: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
  url?: string;
};

export default function Dashboard() {
  const [activeRun, setActiveRun] = useState<Run|null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [mode, setMode] = useState<"auto"|"manual-topic"|"manual-idea">("auto");
  const [manual, setManual] = useState("");
  const [provinces, setProvinces] = useState<string[]>(["BC","AB","ON"]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"runs"|"posts"|"strategy">("runs");
  const [strategy, setStrategy] = useState<any>(null);
  
  const auth = getAuth(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { 
      if (!u) {
        window.location.href="/login"; 
      } else {
        setUser(u);
        loadRuns();
        loadPosts();
        loadStrategy();
      }
    });
    return () => unsub();
  }, [auth]);

  async function loadRuns() {
    try {
      // This would need a /runs endpoint - for now using placeholder
      setRuns([]);
    } catch (e) {
      console.error("Failed to load runs:", e);
    }
  }

  async function loadPosts() {
    try {
      // This would need a /posts endpoint - for now using placeholder
      setPosts([]);
    } catch (e) {
      console.error("Failed to load posts:", e);
    }
  }

  async function loadStrategy() {
    try {
      const data = await apiGet("/strategy/latest");
      setStrategy(data);
    } catch (e) {
      console.error("Failed to load strategy:", e);
    }
  }

  async function makeAdmin() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/make-admin', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const result = await response.json();
      if (result.success) {
        alert('Success! You are now an admin. Please refresh the page.');
      } else {
        alert('Error: ' + (result.error || result.message || 'Unknown error'));
      }
      console.log(result);
    } catch (e) {
      console.error('Make admin error:', e);
      alert('Failed to make admin. Check console.');
    }
  }

  async function triggerRun() {
    setLoading(true);
    console.log("Starting run with:", { mode, manualQuery: manual, targetProvinces: provinces });
    
    try {
      // Add timeout to the request
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      );
      
      const apiPromise = apiPost<{runId:string}>("/run", { 
        mode, 
        manualQuery: manual || undefined, 
        targetProvinces: provinces 
      });
      
      console.log("Waiting for API response...");
      const { runId } = await Promise.race([apiPromise, timeoutPromise]) as {runId: string};
      
      console.log("Got run ID:", runId);
      startPoll(runId);
      setManual("");
    } catch (e) {
      console.error("Failed to start run:", e);
      alert(`Failed to start run: ${(e as Error).message}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  }

  async function startPoll(runId: string) {
    console.log("Starting SSE connection for run:", runId);
    
    const token = await auth.currentUser?.getIdToken();
    const baseUrl = process.env.NEXT_PUBLIC_CREWAPI_BASE_URL || '/api';
    const sseUrl = `${baseUrl}/runs/${runId}/stream?token=${token}`;
    
    console.log("Connecting to SSE:", sseUrl);
    
    const sse = new EventSource(sseUrl, { 
      withCredentials: false 
    });
    
    sse.onopen = () => {
      console.log("SSE connection opened successfully");
    };
    
    sse.onmessage = (e) => { 
      console.log("SSE message received:", e.data);
      try {
        const data = JSON.parse(e.data); 
        if (data.type === "connected") {
          console.log("SSE connected to run:", data.runId);
        } else if (data.type === "run_update") {
          console.log("Run update received:", data.run);
          setActiveRun({ id: runId, ...data.run });
          
          // Check if completed
          const allDone = data.run.steps.every((s: any) => 
            s.status === "ok" || s.status === "error"
          );
          if (allDone) {
            console.log("Run completed, closing SSE");
            sse.close();
            loadRuns();
            loadPosts();
          }
        }
      } catch (parseError) {
        console.error("Failed to parse SSE data:", parseError, e.data);
      }
    };
    
    sse.onerror = (error) => {
      console.error("SSE connection error:", error);
      console.error("SSE readyState:", sse.readyState);
      sse.close();
    };
    
    // Auto-close after 5 minutes to prevent hanging connections
    setTimeout(() => {
      if (sse.readyState === EventSource.OPEN) {
        console.log("Auto-closing SSE after 5 minutes");
        sse.close();
      }
    }, 5 * 60 * 1000);
  }

  async function runWeeklyStrategy() {
    setLoading(true);
    try {
      const result = await apiPost<{actionsCount: number}>("/strategy/weekly", {});
      alert(`Strategy created: ${result.actionsCount} actions generated`);
      loadStrategy();
    } catch (e) {
      console.error("Strategy generation failed:", e);
      alert("Failed to generate strategy");
    } finally {
      setLoading(false);
    }
  }

  async function republishPost(slug: string) {
    try {
      await apiPost("/publish/republish", { slug });
      alert("Post republished successfully");
      loadPosts();
    } catch (e) {
      console.error("Republish failed:", e);
      alert("Failed to republish");
    }
  }

  function StepIndicator({step}: {step: any}) {
    const getIcon = () => {
      switch(step.status) {
        case "ok": return <CheckCircle className="w-5 h-5 text-green-500" />;
        case "running": return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
        case "error": return <XCircle className="w-5 h-5 text-red-500" />;
        default: return <Clock className="w-5 h-5 text-gray-400" />;
      }
    };

    const getColor = () => {
      switch(step.status) {
        case "ok": return "bg-green-50 border-green-200";
        case "running": return "bg-blue-50 border-blue-200 animate-pulse";
        case "error": return "bg-red-50 border-red-200";
        default: return "bg-gray-50 border-gray-200";
      }
    };

    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getColor()}`}>
        {getIcon()}
        <div className="flex-1">
          <div className="font-medium capitalize">{step.agent}</div>
          {step.error && <div className="text-sm text-red-600 mt-1">{step.error}</div>}
        </div>
        {step.finishedAt && (
          <div className="text-xs text-gray-500">
            {new Date(step.finishedAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Kraft Content AI</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              {/* Temporary admin button - remove after setup */}
              <button
                onClick={makeAdmin}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Make Admin
              </button>
              {/* Debug button */}
              <button
                onClick={async () => {
                  try {
                    const token = await auth.currentUser?.getIdToken();
                    const response = await fetch('/api/test-run-creation', {
                      method: 'POST',
                      headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        mode: 'auto',
                        targetProvinces: ['BC', 'AB', 'ON']
                      })
                    });
                    const result = await response.json();
                    console.log('Debug result:', result);
                    alert('Check console for debug output');
                  } catch (e) {
                    console.error('Debug error:', e);
                    alert('Debug failed - check console');
                  }
                }}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Debug Run
              </button>
              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("runs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "runs" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Agent Runs
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "posts" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Posts
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("strategy")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "strategy" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                SEO Strategy
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Runs Tab */}
        {activeTab === "runs" && (
          <div className="space-y-6">
            {/* Run Controls */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Start New Content Run</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    value={mode} 
                    onChange={e => setMode(e.target.value as any)}
                  >
                    <option value="auto">Auto (Find Topics)</option>
                    <option value="manual-topic">Manual Topic</option>
                    <option value="manual-idea">Manual Idea</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {mode === "auto" ? "Auto-discover topics" : "Topic / Idea"}
                  </label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    placeholder={mode === "auto" ? "Leave blank for auto" : "Enter your topic or idea"} 
                    value={manual} 
                    onChange={e => setManual(e.target.value)}
                    disabled={mode === "auto"}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provinces</label>
                  <div className="flex gap-2">
                    {["BC", "AB", "ON"].map(p => (
                      <label key={p} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={provinces.includes(p)}
                          onChange={e => {
                            if (e.target.checked) {
                              setProvinces([...provinces, p]);
                            } else {
                              setProvinces(provinces.filter(pr => pr !== p));
                            }
                          }}
                        />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={triggerRun} 
                disabled={loading || !!activeRun}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {loading ? "Starting..." : "Run Now"}
              </button>
            </div>

            {/* Active Run */}
            {activeRun && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Current Run: {activeRun.id.slice(0, 8)}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Started {new Date(activeRun.startedAt).toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {activeRun.steps.map((step, i) => (
                    <StepIndicator key={i} step={step} />
                  ))}
                </div>
                
                {activeRun.published?.url && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Published:</span>
                      <a 
                        href={activeRun.published.url} 
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {activeRun.published.url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Run History */}
            {runs.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Recent Runs</h2>
                </div>
                <div className="divide-y">
                  {runs.map(run => (
                    <div key={run.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{run.mode}</div>
                          {run.manualQuery && (
                            <div className="text-sm text-gray-600">{run.manualQuery}</div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(run.startedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Published Content</h2>
            </div>
            {posts.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No posts yet. Run an agent to create content.</p>
              </div>
            ) : (
              <div className="divide-y">
                {posts.map(post => (
                  <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <div className="text-sm text-gray-600">/{post.slug}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === "published" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {post.status}
                        </span>
                        <button
                          onClick={() => republishPost(post.slug)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Republish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Strategy Tab */}
        {activeTab === "strategy" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Weekly SEO Strategy</h2>
                <button
                  onClick={runWeeklyStrategy}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <BarChart3 className="w-4 h-4" />
                  Generate Strategy
                </button>
              </div>
              
              {strategy ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Week: {strategy.weekId}</span>
                    <span>Actions: {strategy.actions?.length || 0}</span>
                    <span>Opportunities: {strategy.metrics?.total_opportunities || 0}</span>
                  </div>
                  
                  {strategy.actions?.map((action: any, i: number) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          action.priority === "high" 
                            ? "bg-red-100 text-red-700"
                            : action.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                      {action.estimated_hours && (
                        <div className="text-xs text-gray-500 mt-2">
                          Est. {action.estimated_hours} hours
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No strategy generated yet. Click generate to create one.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}