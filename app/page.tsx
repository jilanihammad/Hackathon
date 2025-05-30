"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"

// Mock data - replace with real API calls
const mockProducts = [
  { id: "apb-001", name: "APB Wireless Headphones Pro", category: "Audio", asin: "B08XYZ123" },
  { id: "apb-002", name: "APB Smart Watch Series 3", category: "Wearables", asin: "B09ABC456" },
  { id: "comp-001", name: "Sony WH-1000XM5", category: "Audio", asin: "B09DEF789" },
]

const mockFeatureRecommendations = [
  {
    id: 1,
    feature: "Active Noise Cancellation",
    type: "add",
    priority: "Add feature",
    sentiment: 0.85,
    mentions: 1247,
    costEstimate: "$2.5M",
    impact: "high",
    customerQuote: "I wish these had better noise cancellation like the Sony ones",
    confidence: 92,
  },
  {
    id: 2,
    feature: "Wireless Charging Case",
    type: "add",
    priority: "Add feature",
    sentiment: 0.72,
    mentions: 892,
    costEstimate: "$1.2M",
    impact: "medium",
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
    costEstimate: "$800K",
    impact: "high",
    customerQuote: "Touch controls are too sensitive and frustrating",
    confidence: 89,
  },
  {
    id: 4,
    feature: "Bulky Design",
    type: "remove",
    priority: "Remove feature",
    sentiment: -0.62,
    mentions: 567,
    costEstimate: "$1.8M",
    impact: "medium",
    customerQuote: "These are too bulky compared to competitors",
    confidence: 71,
  },
]

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

export default function ProductInsightsDashboard() {
  // State with localStorage persistence
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedPeers, setSelectedPeers] = useState("")
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState("all")

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory")
    const savedPriority = localStorage.getItem("priorityFilter")
    const savedPeers = localStorage.getItem("selectedPeers")

    if (savedCategory) setSelectedCategory(savedCategory)
    if (savedPriority) setPriorityFilter(savedPriority)
    if (savedPeers) setSelectedPeers(savedPeers)
  }, [])

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory)
    localStorage.setItem("priorityFilter", priorityFilter)
    localStorage.setItem("selectedPeers", selectedPeers)
  }, [selectedCategory, priorityFilter, selectedPeers])

  const filteredRecommendations = mockFeatureRecommendations.filter(
    (rec) => priorityFilter === "all" || rec.priority === priorityFilter,
  )

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
  }

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
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return "text-green-600"
    if (sentiment > 0.2) return "text-yellow-600"
    return "text-red-600"
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleIntegrationSubmit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsIntegrationDialogOpen(false)
      // Show success notification or update UI
      alert("Integration successful!")
    }, 2000)
  }

  const resetFilters = () => {
    setSelectedCategory("")
    setPriorityFilter("all")
    setSelectedPeers("")
    localStorage.removeItem("selectedCategory")
    localStorage.removeItem("priorityFilter")
    localStorage.removeItem("selectedPeers")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Insights Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered customer feedback analysis for product development</p>
            </div>
            <div className="flex space-x-3">
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
        {/* Filters */}
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Sentiment</p>
                  <p className="text-2xl font-bold text-green-600">+68%</p>
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
                  <p className="text-sm font-medium text-gray-600">Est. Revenue Impact</p>
                  <p className="text-2xl font-bold text-green-600">$12.4M</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">From top 3 recommendations</p>
            </CardContent>
          </Card>
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
                          <p className="text-sm text-gray-600">Sentiment Score</p>
                          <p className={`text-lg font-bold ${getSentimentColor(rec.sentiment)}`}>
                            {rec.sentiment > 0 ? "+" : ""}
                            {(rec.sentiment * 100).toFixed(0)}%
                          </p>
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
                          <p className="text-sm text-gray-600">Impact</p>
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
                        <th className="text-center p-3 bg-gray-50">Sentiment</th>
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

            <Card>
              <CardHeader>
                <CardTitle>Feature Gap Analysis</CardTitle>
                <CardDescription>Key features missing from your product compared to competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPeerComparison
                    .filter((item) => !item.ourProduct && item.customerDemand === "high")
                    .map((item, index) => {
                      const peerType = selectedPeers || "cmt"
                      const peerData = item.peers[peerType as keyof typeof item.peers] || []
                      const adoptionRate = peerData.filter((peer) => peer.has).length / peerData.length

                      return (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.feature}</h4>
                              <p className="text-sm text-gray-500">
                                {Math.round(adoptionRate * 100)}% of peers have this feature
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              {item.customerDemand} demand
                            </Badge>
                            <Button size="sm">Add to Roadmap</Button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Sentiment Breakdown</CardTitle>
                  <CardDescription>Customer satisfaction by feature category</CardDescription>
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
                  <CardTitle>Sentiment Trends</CardTitle>
                  <CardDescription>Sentiment evolution over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Sentiment trend chart would be rendered here</p>
                      <p className="text-sm">Integration with charting library needed</p>
                    </div>
                  </div>
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
                        <th className="text-left p-3">PCOGs</th>
                        <th className="text-left p-3">Yearly GMS</th>
                        <th className="text-left p-3">ROI</th>
                        <th className="text-left p-3">Confidence Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecommendations.map((rec) => (
                        <tr key={rec.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{rec.feature}</td>
                          <td className="p-3">$12.50 per unit</td>
                          <td className="p-3 text-green-600">$85 per unit</td>
                          <td className="p-3 text-green-600 font-bold">168%</td>
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
                <div className="mb-6">
                  <Label htmlFor="feature-filter" className="text-sm font-medium mb-2 block">
                    Filter by Feature
                  </Label>
                  <Select value={selectedFeatureFilter} onValueChange={setSelectedFeatureFilter}>
                    <SelectTrigger className="w-full md:w-64">
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
