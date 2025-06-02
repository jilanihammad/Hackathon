"use client" // This directive tells Next.js to run this code in the browser (client-side), not on the server.

// --- Imports ---
// These bring in libraries and components needed for the dashboard.
import type React from "react" // Type definitions for React to help with code reliability (optional but useful for TypeScript).
import { useState, useEffect } from "react" // React hooks: useState manages dynamic data, useEffect runs code at specific times.
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card" // UI components for boxed content sections.
import { Button } from "@/components/ui/button" // A reusable button component.
import { Badge } from "@/components/ui/badge" // Small labels for highlighting info (e.g., "high priority").
import { Progress } from "@/components/ui/progress" // A progress bar for visual percentages.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Components for tabbed navigation.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Dropdown menu components.
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" // Pop-up dialog components (e.g., for data integration).
import { Input } from "@/components/ui/input" // Text input fields (e.g., for API keys or file uploads).
import { Label } from "@/components/ui/label" // Labels to describe inputs.
import {
  DollarSign,
  Target,
  Search,
  BarChart3,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Database,
  RefreshCw,
  FileSpreadsheet,
  BarChart,
} from "lucide-react" // Icons to enhance the UI visually.

// --- Mock Data ---
// Fake data to simulate real customer feedback and product info. Replace with API calls or real data later.
const mockProducts = [
  { id: "apb-001", name: "APB Wireless Headphones Pro", category: "Audio", asin: "B08XYZ123" },
  { id: "apb-002", name: "APB Smart Watch Series 3", category: "Wearables", asin: "B09ABC456" },
  { id: "comp-001", name: "Sony WH-1000XM5", category: "Audio", asin: "B09DEF789" },
]
// **Edit Here:** Add more products by following this format: { id, name, category, asin }.

const mockFeatureRecommendations = [
  {
    id: 1,
    feature: "Active Noise Cancellation",
    type: "add",
    priority: "Add feature",
    sentiment: 0.85,
    mentions: 1247,
    costEstimate: "$2.5M",
    impact: "140%",
    customerQuote: "I LOVE the noise cancellation feature at this price point!",
    confidence: 92,
  },
  {
    id: 2,
    feature: "Wireless Charging Case",
    type: "add",
    priority: "Add feature",
    sentiment: 0.72,
    mentions: 892,
    costEstimate: "$2.8M",
    impact: "125%",
    customerQuote: "Would love wireless charging for convenience",
    confidence: 78,
  },
  {
    id: 3,
    feature: "Touch Controls",
    type: "improve",
    priority: "Ambiguous",
    sentiment: -0.45,
    mentions: 2156,
    costEstimate: "$3.2M",
    impact: "109%",
    customerQuote: "Touch controls are too sensitive and a bit frustrating",
    confidence: 89,
  },
  {
    id: 4,
    feature: "Metallic Body",
    type: "remove",
    priority: "Remove feature",
    sentiment: -0.62,
    mentions: 567,
    costEstimate: "$3.8M",
    impact: "92%",
    customerQuote: "These are too heavy compared to my Beats",
    confidence: 71,
  },
]
// **Edit Here:** Add new recommendations by copying this structure and updating values.

const mockSentimentData = {
  overall: 0.68,
  features: {
    "Sound Quality": 0.82,
    "Battery Life": 0.75,
    Comfort: 0.45,
    "Build Quality": 0.71,
    Price: 0.38,
  },
}
// **Edit Here:** Update sentiment scores (0 to 1) or add new features.

const mockPeerComparison = [
  {
    feature: "Active Noise Cancellation",
    ourProduct: false,
    peers: {
      cmt: [
        { name: "Sony WH-1000XM5", has: true },
        { name: "Bose QC45", has: true },
        { name: "Apple AirPods Pro", has: true },
      ],
      wide: [
        { name: "JBL Live 660NC", has: true },
        { name: "Sennheiser HD 450BT", has: true },
        { name: "Anker Soundcore Q30", has: false },
      ],
      narrow: [
        { name: "Audio-Technica ATH-M50xBT", has: false },
        { name: "Jabra Elite 85h", has: true },
        { name: "Beats Studio3", has: true },
      ],
    },
    sentiment: 0.85,
    customerDemand: "high",
  },
  {
    feature: "Wireless Charging",
    ourProduct: false,
    peers: {
      cmt: [
        { name: "Sony WH-1000XM5", has: true },
        { name: "Bose QC45", has: false },
        { name: "Apple AirPods Pro", has: true },
      ],
      wide: [
        { name: "JBL Live 660NC", has: false },
        { name: "Sennheiser HD 450BT", has: false },
        { name: "Anker Soundcore Q30", has: false },
      ],
      narrow: [
        { name: "Audio-Technica ATH-M50xBT", has: false },
        { name: "Jabra Elite 85h", has: false },
        { name: "Beats Studio3", has: true },
      ],
    },
    sentiment: 0.72,
    customerDemand: "medium",
  },
  {
    feature: "Battery Life (20+ hours)",
    ourProduct: true,
    peers: {
      cmt: [
        { name: "Sony WH-1000XM5", has: true },
        { name: "Bose QC45", has: true },
        { name: "Apple AirPods Pro", has: false },
      ],
      wide: [
        { name: "JBL Live 660NC", has: true },
        { name: "Sennheiser HD 450BT", has: true },
        { name: "Anker Soundcore Q30", has: true },
      ],
      narrow: [
        { name: "Audio-Technica ATH-M50xBT", has: true },
        { name: "Jabra Elite 85h", has: true },
        { name: "Beats Studio3", has: true },
      ],
    },
    sentiment: 0.88,
    customerDemand: "high",
  },
  {
    feature: "Foldable Design",
    ourProduct: true,
    peers: {
      cmt: [
        { name: "Sony WH-1000XM5", has: true },
        { name: "Bose QC45", has: true },
        { name: "Apple AirPods Pro", has: false },
      ],
      wide: [
        { name: "JBL Live 660NC", has: true },
        { name: "Sennheiser HD 450BT", has: true },
        { name: "Anker Soundcore Q30", has: true },
      ],
      narrow: [
        { name: "Audio-Technica ATH-M50xBT", has: true },
        { name: "Jabra Elite 85h", has: false },
        { name: "Beats Studio3", has: true },
      ],
    },
    sentiment: 0.65,
    customerDemand: "medium",
  },
  {
    feature: "Multi-device Connection",
    ourProduct: false,
    peers: {
      cmt: [
        { name: "Sony WH-1000XM5", has: true },
        { name: "Bose QC45", has: true },
        { name: "Apple AirPods Pro", has: true },
      ],
      wide: [
        { name: "JBL Live 660NC", has: false },
        { name: "Sennheiser HD 450BT", has: true },
        { name: "Anker Soundcore Q30", has: false },
      ],
      narrow: [
        { name: "Audio-Technica ATH-M50xBT", has: false },
        { name: "Jabra Elite 85h", has: true },
        { name: "Beats Studio3", has: false },
      ],
    },
    sentiment: 0.78,
    customerDemand: "high",
  },
]
// **Edit Here:** Add new features or competitors by copying this structure.

const mockCustomerReviewsByFeature = {
  "Sound Quality": {
    searchTerms: ["sound quality", "audio", "bass", "treble", "clarity", "crisp", "clear sound"],
    reviews: [
      {
        id: 1,
        text: "Amazing sound quality, best I've heard in this price range",
        rating: 5,
        sentiment: "positive",
        verified: true,
        date: "2024-01-15",
      },
      {
        id: 2,
        text: "The audio is crystal clear, especially the bass response",
        rating: 5,
        sentiment: "positive",
        verified: true,
        date: "2024-01-12",
      },
      {
        id: 3,
        text: "Sound quality could be better, feels a bit muffled",
        rating: 3,
        sentiment: "negative",
        verified: true,
        date: "2024-01-10",
      },
    ],
  },
  "Battery Life": {
    searchTerms: ["battery", "battery life", "charge", "charging", "power", "lasting"],
    reviews: [
      {
        id: 4,
        text: "Battery life is incredible, lasts all day",
        rating: 5,
        sentiment: "positive",
        verified: true,
        date: "2024-01-14",
      },
      {
        id: 5,
        text: "Love the quick charge feature, very convenient",
        rating: 4,
        sentiment: "positive",
        verified: true,
        date: "2024-01-11",
      },
      {
        id: 6,
        text: "Battery drains faster than expected during calls",
        rating: 2,
        sentiment: "negative",
        verified: true,
        date: "2024-01-09",
      },
    ],
  },
  Comfort: {
    searchTerms: ["comfort", "comfortable", "fit", "ear", "padding", "ergonomic"],
    reviews: [
      {
        id: 7,
        text: "Very comfortable for long listening sessions",
        rating: 4,
        sentiment: "positive",
        verified: true,
        date: "2024-01-13",
      },
      {
        id: 8,
        text: "Fits perfectly, no ear fatigue after hours of use",
        rating: 5,
        sentiment: "positive",
        verified: true,
        date: "2024-01-08",
      },
      {
        id: 9,
        text: "Too tight on my head, becomes uncomfortable after 30 minutes",
        rating: 2,
        sentiment: "negative",
        verified: true,
        date: "2024-01-07",
      },
    ],
  },
  "Touch Controls": {
    searchTerms: ["touch controls", "controls", "buttons", "touch", "gestures", "interface"],
    reviews: [
      {
        id: 10,
        text: "Touch controls are too sensitive, constantly pausing music",
        rating: 2,
        sentiment: "negative",
        verified: true,
        date: "2024-01-06",
      },
      {
        id: 11,
        text: "Controls are intuitive once you get used to them",
        rating: 4,
        sentiment: "positive",
        verified: true,
        date: "2024-01-05",
      },
      {
        id: 12,
        text: "Wish there were physical buttons instead of touch",
        rating: 3,
        sentiment: "negative",
        verified: true,
        date: "2024-01-04",
      },
    ],
  },
  "Build Quality": {
    searchTerms: ["build quality", "construction", "materials", "durability", "solid", "sturdy"],
    reviews: [
      {
        id: 13,
        text: "Solid build quality, feels premium",
        rating: 5,
        sentiment: "positive",
        verified: true,
        date: "2024-01-03",
      },
      {
        id: 14,
        text: "Materials feel cheap for the price point",
        rating: 2,
        sentiment: "negative",
        verified: true,
        date: "2024-01-02",
      },
      {
        id: 15,
        text: "Well constructed, should last for years",
        rating: 4,
        sentiment: "positive",
        verified: true,
        date: "2024-01-01",
      },
    ],
  },
}
// **Edit Here:** Add new features or reviews by copying this structure.

const mockSentimentTrends = {
  "Sound Quality": [
    { month: "2023-07", mentions: 245 },
    { month: "2023-08", mentions: 312 },
    { month: "2023-09", mentions: 289 },
    { month: "2023-10", mentions: 356 },
    { month: "2023-11", mentions: 423 },
    { month: "2023-12", mentions: 398 },
    { month: "2024-01", mentions: 467 },
  ],
  "Battery Life": [
    { month: "2023-07", mentions: 189 },
    { month: "2023-08", mentions: 234 },
    { month: "2023-09", mentions: 267 },
    { month: "2023-10", mentions: 298 },
    { month: "2023-11", mentions: 334 },
    { month: "2023-12", mentions: 356 },
    { month: "2024-01", mentions: 389 },
  ],
  Comfort: [
    { month: "2023-07", mentions: 156 },
    { month: "2023-08", mentions: 178 },
    { month: "2023-09", mentions: 203 },
    { month: "2023-10", mentions: 234 },
    { month: "2023-11", mentions: 267 },
    { month: "2023-12", mentions: 289 },
    { month: "2024-01", mentions: 312 },
  ],
  "Touch Controls": [
    { month: "2023-07", mentions: 134 },
    { month: "2023-08", mentions: 167 },
    { month: "2023-09", mentions: 189 },
    { month: "2023-10", mentions: 212 },
    { month: "2023-11", mentions: 245 },
    { month: "2023-12", mentions: 278 },
    { month: "2024-01", mentions: 301 },
  ],
  "Build Quality": [
    { month: "2023-07", mentions: 98 },
    { month: "2023-08", mentions: 123 },
    { month: "2023-09", mentions: 145 },
    { month: "2023-10", mentions: 167 },
    { month: "2023-11", mentions: 189 },
    { month: "2023-12", mentions: 212 },
    { month: "2024-01", mentions: 234 },
  ],
}
// **Edit Here:** Add new features or time periods for trends.

const featureColors = {
  "Sound Quality": "#3B82F6",
  "Battery Life": "#10B981",
  Comfort: "#F59E0B",
  "Touch Controls": "#EF4444",
  "Build Quality": "#8B5CF6",
}
// **Edit Here:** Add new features and their colors for the trend chart.

// --- Main Dashboard Component ---
export default function ProductInsightsDashboard() {
  // --- State Variables ---
  // These hold data that changes based on user interaction, persisted with localStorage.
  const [selectedCategory, setSelectedCategory] = useState("") // Tracks the selected product category.
  const [priorityFilter, setPriorityFilter] = useState("all") // Filters recommendations by priority.
  const [selectedPeers, setSelectedPeers] = useState("") // Tracks the selected peer group for comparison.
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false) // Controls visibility of the integration dialog.
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Stores the file selected for upload.
  const [apiKey, setApiKey] = useState("") // Stores the API key entered by the user.
  const [isLoading, setIsLoading] = useState(false) // Tracks if an operation (e.g., integration) is in progress.
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState("all") // Filters reviews by feature.
  const [selectedSourceFilter, setSelectedSourceFilter] = useState("all") // Filters reviews by source.
  const [selectedPeerFilter, setSelectedPeerFilter] = useState("all") // Filters peer comparison data.
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState("all") // Filters sentiment analysis data.

  // --- Load Saved Filters ---
  // Restores user selections from localStorage when the dashboard loads.
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory")
    const savedPriority = localStorage.getItem("priorityFilter")
    const savedPeers = localStorage.getItem("selectedPeers")
    if (savedCategory) setSelectedCategory(savedCategory)
    if (savedPriority) setPriorityFilter(savedPriority)
    if (savedPeers) setSelectedPeers(savedPeers)
  }, []) // Empty array means this runs once when the component mounts.

  // --- Save Filters ---
  // Saves user selections to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory)
    localStorage.setItem("priorityFilter", priorityFilter)
    localStorage.setItem("selectedPeers", selectedPeers)
  }, [selectedCategory, priorityFilter, selectedPeers]) // Runs when these values change.

  // --- Filter Recommendations ---
  // Filters the feature recommendations based on the selected priority.
  const filteredRecommendations = mockFeatureRecommendations.filter(
    (rec) => priorityFilter === "all" || rec.priority === priorityFilter,
  )

  // --- Helper Functions ---
  // These handle styling and logic for the dashboard.

  // Returns a color class for priority badges based on the priority type.
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Add feature":
        return "bg-green-100 text-green-800 border-green-200"
      case "Remove feature":
        return "bg-red-100 text-red-800 border-red-200"
      case "Ambiguous":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
    // **Edit Here:** Add more priority types and colors if needed.
  }

  // Returns an icon based on the recommendation type.
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "add":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "improve":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "remove":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
    // **Edit Here:** Add new types and icons as needed.
  }

  // Returns a text color class based on sentiment score.
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return "text-green-600"
    if (sentiment > 0.2) return "text-yellow-600"
    return "text-red-600"
    // **Edit Here:** Adjust thresholds (0.6, 0.2) to change color ranges.
  }

  // Updates the selected file when a user uploads one.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Simulates submitting an integration (API key or file upload).
  const handleIntegrationSubmit = () => {
    setIsLoading(true) // Show loading state.
    // Fake delay to mimic an API call.
    setTimeout(() => {
      setIsLoading(false)
      setIsIntegrationDialogOpen(false) // Close the dialog.
      alert("Integration successful!") // Notify the user.
    }, 2000) // 2-second delay.
    // **Edit Here:** Replace with real API integration logic.
  }

  // Resets all filters to their default values and clears localStorage.
  const resetFilters = () => {
    setSelectedCategory("")
    setPriorityFilter("all")
    setSelectedPeers("")
    setSelectedSourceFilter("all")
    setSelectedPeerFilter("all")
    setSelectedSentimentFilter("all")
    localStorage.removeItem("selectedCategory")
    localStorage.removeItem("priorityFilter")
    localStorage.removeItem("selectedPeers")
    localStorage.removeItem("selectedSourceFilter")
    localStorage.removeItem("selectedPeerFilter")
    localStorage.removeItem("selectedSentimentFilter")
  }

  // --- Sentiment Trend Chart Component ---
  // Creates a line chart showing feature mentions over time.
  const SentimentTrendChart = () => {
    const chartWidth = 600 // Width of the chart in pixels.
    const chartHeight = 300 // Height of the chart.
    const padding = 60 // Space around the chart for labels and axes.

    const allMonths = mockSentimentTrends["Sound Quality"].map((d) => d.month) // List of months from data.
    const maxMentions = Math.max(
      ...Object.values(mockSentimentTrends)
        .flat()
        .map((d) => d.mentions),
    ) // Highest mention count for scaling the y-axis.

    const getX = (index: number) => padding + (index * (chartWidth - 2 * padding)) / (allMonths.length - 1) // Calculates x-position for data points.
    const getY = (mentions: number) => chartHeight - padding - (mentions / maxMentions) * (chartHeight - 2 * padding) // Calculates y-position.

    return (
      <div className="w-full overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="border rounded">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (i * (chartHeight - 2 * padding)) / 4
            return (
              <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            )
          })}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const value = Math.round((maxMentions * (4 - i)) / 4)
            const y = padding + (i * (chartHeight - 2 * padding)) / 4
            return (
              <text key={i} x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6B7280">
                {value}
              </text>
            )
          })}

          {/* X-axis labels */}
          {allMonths.map((month, index) => (
            <text
              key={month}
              x={getX(index)}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              {new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
            </text>
          ))}

          {/* Feature lines */}
          {Object.entries(mockSentimentTrends).map(([feature, data]) => {
            const pathData = data
              .map((d, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(d.mentions)}`)
              .join(" ")
            return (
              <g key={feature}>
                <path d={pathData} fill="none" stroke={featureColors[feature]} strokeWidth="2" />
                {data.map((d, index) => (
                  <circle key={index} cx={getX(index)} cy={getY(d.mentions)} r="4" fill={featureColors[feature]} />
                ))}
              </g>
            )
          })}

          {/* Axis titles */}
          <text x={chartWidth / 2} y={chartHeight - 10} textAnchor="middle" fontSize="14" fill="#374151">
            Time Period
          </text>
          <text
            x={20}
            y={chartHeight / 2}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            transform={`rotate(-90 20 ${chartHeight / 2})`}
          >
            Number of Mentions
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(featureColors).map(([feature, color]) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    )
    // **Edit Here:** Adjust chartWidth or chartHeight to resize the chart.
  }

  // --- Main Dashboard UI ---
  // Defines the layout and structure of the dashboard.
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Insights Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered customer feedback analysis for product development</p>
            </div>
            <div className="flex space-x-3">
              {/* Integration Dialog */}
              <Dialog open={isIntegrationDialogOpen} onOpenChange={setIsIntegrationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Data Integration</DialogTitle>
                    <DialogDescription>
                      Connect to your data source or upload an Excel file with customer reviews.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">Connect to your review data source using an API key.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="file">Upload Excel File</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload an Excel file with customer reviews and product data.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsIntegrationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleIntegrationSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Analysis Configuration
            </CardTitle>
            <CardDescription>Select products and configure analysis parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="IRN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="wearables">Wearables</SelectItem>
                  <SelectItem value="smart-home">Smart Home</SelectItem>
                  {/* **Edit Here:** Add more categories by copying <SelectItem> tags. */}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="ASIN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ASINs</SelectItem>
                  <SelectItem value="B08XYZ123">B08XYZ123</SelectItem>
                  <SelectItem value="B09ABC456">B09ABC456</SelectItem>
                  <SelectItem value="B09DEF789">B09DEF789</SelectItem>
                  {/* **Edit Here:** Add more ASINs from mockProducts. */}
                </SelectContent>
              </Select>

              <Select value={selectedPeers} onValueChange={setSelectedPeers}>
                <SelectTrigger>
                  <SelectValue placeholder="Peers: CMT/Wide/Narrow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cmt">CMT</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="narrow">Narrow</SelectItem>
                  {/* **Edit Here:** Add more peer groups. */}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
                <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Star Ratings</p>
                  <p className="text-2xl font-bold text-green-600">4.3</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">↗ 12% from last analysis</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviews Analyzed</p>
                  <p className="text-2xl font-bold text-blue-600">24,567</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Across 8 competitor products</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Feature Gaps</p>
                  <p className="text-2xl font-bold text-red-600">7</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">High-impact opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Potential iGMS</p>
                  <p className="text-2xl font-bold text-green-600">$12.4M</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">From 7 feature additions</p>
            </CardContent>
          </Card>
          {/* **Edit Here:** Add more metric cards by copying this structure and updating values/icons. */}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">Feature Recommendations</TabsTrigger>
            <TabsTrigger value="peer-comparison">Peer Comparison</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="cost-benefit">Cost-Benefit Analysis</TabsTrigger>
            <TabsTrigger value="voice-customer">Voice of Customer</TabsTrigger>
          </TabsList>

          {/* Feature Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI-Powered Feature Recommendations
                </CardTitle>
                <CardDescription>Actionable insights based on customer feedback analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(rec.type)}
                          <div>
                            <h3 className="font-semibold text-lg">{rec.feature}</h3>
                            <p className="text-sm text-gray-600 capitalize">{rec.type} Feature</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                          <Badge variant="outline">{rec.confidence}% confidence</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Incremental Revenue</p>
                          <p className="text-lg font-bold text-green-600">$3.5M/year</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Mentions</p>
                          <p className="text-lg font-bold text-blue-600">{rec.mentions.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Est. Cost</p>
                          <p className="text-lg font-bold text-orange-600">{rec.costEstimate}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">ROI</p>
                          <p
                            className={`text-lg font-bold ${rec.impact === "high" ? "text-green-600" : "text-yellow-600"}`}
                          >
                            {rec.impact}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Customer Voice</p>
                            <p className="text-sm text-blue-700 italic">"{rec.customerQuote}"</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Peer Comparison Tab */}
          <TabsContent value="peer-comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Competitive Feature Analysis
                </CardTitle>
                <CardDescription>Compare your product features against top competitors in the market</CardDescription>
                <div className="pt-4">
                  <Label htmlFor="peer-filter" className="text-sm font-medium mb-2 block">
                    Filter by Peer Group
                  </Label>
                  <Select value={selectedPeerFilter} onValueChange={setSelectedPeerFilter}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="All Peer Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Peer Groups</SelectItem>
                      <SelectItem value="cmts">CMTs</SelectItem>
                      <SelectItem value="wide">Wide Peers</SelectItem>
                      <SelectItem value="narrow">Narrow Peers</SelectItem>
                      {/* **Edit Here:** Add more peer group options. */}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 bg-gray-50">Feature</th>
                        <th className="text-center p-3 bg-gray-50">Our Product</th>
                        <th className="text-center p-3 bg-gray-50">
                          {selectedPeers ? `${selectedPeers.toUpperCase()} Peers` : "All Peers"}
                        </th>
                        <th className="text-center p-3 bg-gray-50">Customer Demand</th>
                        <th className="text-center p-3 bg-gray-50">Quality Score</th>
                        <th className="text-center p-3 bg-gray-50">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPeerComparison.map((item, index) => {
                        // Calculate peer adoption percentage based on selected peer type
                        const peerType = selectedPeers || "cmt"
                        const peerData = item.peers[peerType as keyof typeof item.peers] || []
                        const adoptionRate = peerData.filter((peer) => peer.has).length / peerData.length

                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{item.feature}</td>
                            <td className="p-3 text-center">
                              {item.ourProduct ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col items-center">
                                <Progress value={adoptionRate * 100} className="w-24 mb-1" />
                                <span className="text-xs font-medium">{Math.round(adoptionRate * 100)}% adoption</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <Badge
                                variant="outline"
                                className={
                                  item.customerDemand === "high"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                }
                              >
                                {item.customerDemand}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col items-center">
                                <Progress value={item.sentiment * 100} className="w-24 mb-1" />
                                <span className={`text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                                  {(item.sentiment * 100).toFixed(0)}%
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              {!item.ourProduct && item.customerDemand === "high" && adoptionRate > 0.5 ? (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Add Feature
                                </Button>
                              ) : item.ourProduct && adoptionRate < 0.3 && item.customerDemand !== "high" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Consider Removing
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" /> Review
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Peer Groups:</span> CMT (Category Market Top), Wide (Broader Market),
                    Narrow (Direct Competitors)
                  </div>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Comparison
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Quality Score Breakdown</CardTitle>
                <CardDescription>Customer sentiment analysis across different sources and features</CardDescription>
                <div className="pt-4">
                  <Label htmlFor="sentiment-filter" className="text-sm font-medium mb-2 block">
                    Filter by Source
                  </Label>
                  <Select value={selectedSentimentFilter} onValueChange={setSelectedSentimentFilter}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="apb-asin">APB ASIN</SelectItem>
                      <SelectItem value="cmts">CMTs</SelectItem>
                      <SelectItem value="wide-peers">Wide Peers</SelectItem>
                      <SelectItem value="narrow-peers">Narrow Peers</SelectItem>
                      {/* **Edit Here:** Add more source options. */}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Quality Score Breakdown</CardTitle>
                  <CardDescription>
                    Customer satisfaction by feature category
                    {selectedSentimentFilter !== "all" && (
                      <span className="ml-2 text-blue-600">
                        (Filtered by: {selectedSentimentFilter.replace("-", " ").toUpperCase()})
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockSentimentData.features).map(([feature, sentiment]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{feature}</span>
                        <div className="flex items-center space-x-3">
                          <Progress value={sentiment * 100} className="w-24" />
                          <span className={`text-sm font-bold ${getSentimentColor(sentiment)}`}>
                            {(sentiment * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Trends Over Time</CardTitle>
                  <CardDescription>
                    Feature mention trends by month
                    {selectedSentimentFilter !== "all" && (
                      <span className="ml-2 text-blue-600">
                        (Filtered by: {selectedSentimentFilter.replace("-", " ").toUpperCase()})
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SentimentTrendChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cost-Benefit Analysis Tab */}
          <TabsContent value="cost-benefit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost-Benefit Analysis</CardTitle>
                <CardDescription>ROI projections for feature implementations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Feature</th>
                        <th className="text-left p-3">iPCOGs/Year</th>
                        <th className="text-left p-3">iGMS/Year</th>
                        <th className="text-left p-3">ROI</th>
                        <th className="text-left p-3">Confidence Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecommendations.map((rec) => (
                        <tr key={rec.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{rec.feature}</td>
                          <td className="p-3">$1.8M</td>
                          <td className="p-3 text-green-600">$3.5M</td>
                          <td className="p-3 text-green-600 font-bold">194%</td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={rec.confidence > 80 ? "text-green-600" : "text-yellow-600"}
                            >
                              {rec.confidence}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice of Customer Tab */}
          <TabsContent value="voice-customer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice of Customer Insights</CardTitle>
                <CardDescription>Direct customer feedback and quotes filtered by product features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="feature-filter" className="text-sm font-medium mb-2 block">
                      Filter by Feature
                    </Label>
                    <Select value={selectedFeatureFilter} onValueChange={setSelectedFeatureFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Features" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Features</SelectItem>
                        {Object.keys(mockCustomerReviewsByFeature).map((feature) => (
                          <SelectItem key={feature} value={feature}>
                            {feature}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="source-filter" className="text-sm font-medium mb-2 block">
                      Filter by Source
                    </Label>
                    <Select value={selectedSourceFilter} onValueChange={setSelectedSourceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="apb-asin">APB ASIN</SelectItem>
                        <SelectItem value="cmts">CMTs</SelectItem>
                        <SelectItem value="wide-peers">Wide Peers</SelectItem>
                        <SelectItem value="narrow-peers">Narrow Peers</SelectItem>
                        {/* **Edit Here:** Add more source options. */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedFeatureFilter && selectedFeatureFilter !== "all" ? (
                  <div className="space-y-6">
                    {/* Search Terms Section */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-800">
                          Search Terms for "{selectedFeatureFilter}"
                        </CardTitle>
                        <CardDescription className="text-blue-600">
                          {mockCustomerReviewsByFeature[selectedFeatureFilter].searchTerms.length} related search terms
                          identified
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {mockCustomerReviewsByFeature[selectedFeatureFilter].searchTerms.map((term, index) => (
                            <Badge key={index} variant="outline" className="bg-white text-blue-700 border-blue-300">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Reviews Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Customer Reviews - {selectedFeatureFilter}</span>
                          <Badge variant="outline">
                            {mockCustomerReviewsByFeature[selectedFeatureFilter].reviews.length} reviews
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockCustomerReviewsByFeature[selectedFeatureFilter].reviews.map((review) => (
                            <div
                              key={review.id}
                              className={`p-4 rounded-lg border-l-4 ${
                                review.sentiment === "positive"
                                  ? "bg-green-50 border-green-400"
                                  : "bg-red-50 border-red-400"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  {review.verified && (
                                    <Badge variant="outline" className="text-xs">
                                      Verified Purchase
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-sm italic mb-2">"{review.text}"</p>
                              <div className="flex items-center space-x-2">
                                {review.sentiment === "positive" ? (
                                  <ThumbsUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ThumbsDown className="h-4 w-4 text-red-600" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    review.sentiment === "positive" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {review.sentiment === "positive" ? "Positive" : "Negative"} sentiment
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-green-600 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Positive Feedback
                      </h3>
                      {[
                        "Amazing sound quality, best I've heard in this price range",
                        "Battery life is incredible, lasts all day",
                        "Love the quick charge feature, very convenient",
                      ].map((quote, index) => (
                        <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4">
                          <p className="text-sm italic">"{quote}"</p>
                          <p className="text-xs text-gray-500 mt-2">★★★★★ Verified Purchase</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-red-600 flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Areas for Improvement
                      </h3>
                      {[
                        "Touch controls are too sensitive, constantly pausing music",
                        "Wish they had active noise cancellation like competitors",
                        "Case is too bulky for pocket carry",
                      ].map((quote, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4">
                          <p className="text-sm italic">"{quote}"</p>
                          <p className="text-xs text-gray-500 mt-2">★★★☆☆ Verified Purchase</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}