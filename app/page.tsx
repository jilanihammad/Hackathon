"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
// Using Unicode symbols instead of lucide-react icons

// --- Mock Data (keeping existing recommendations data) ---
const mockFeatureRecommendations = [
  {
    id: 1,
    feature: "Active Noise Cancellation",
    type: "add",
    priority: "Add feature",
    sentiment: 0.85,
    mentions: "95%",
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
}

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
}

const featureColors = {
  "Sound Quality": "#3B82F6",
  "Battery Life": "#10B981",
  Comfort: "#F59E0B",
}

// Mentions Trend Chart Component
const CustomerMentionChart = () => {
  const chartWidth = 600
  const chartHeight = 300
  const padding = 60

  const allMonths = mockSentimentTrends["Sound Quality"].map((d) => d.month)
  const maxMentions = Math.max(
    ...Object.values(mockSentimentTrends)
      .flat()
      .map((d) => d.mentions),
  )

  const getX = (index) => padding + (index * (chartWidth - 2 * padding)) / (allMonths.length - 1)
  const getY = (mentions) => chartHeight - padding - (mentions / maxMentions) * (chartHeight - 2 * padding)

  return (
    <div className="w-full overflow-x-auto">
      <svg width={chartWidth} height={chartHeight} className="border rounded">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + (i * (chartHeight - 2 * padding)) / 4
          return <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#E5E7EB" strokeWidth="1" />
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

        {/* Axis labels */}
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
          Mentions Count
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
}

// --- Main Dashboard Component ---
export default function ProductInsightsDashboard() {
  // --- State Variables ---
  const [productData, setProductData] = useState({
    // Default/Fallback data - always available
    irns: [
      { id: "Audio & Video Connectors & Adapters", name: "Audio & Video Connectors & Adapters" },
      { id: "Cat 6 Ethernet Cables", name: "Cat 6 Ethernet Cables" },
      { id: "Cat 7 Ethernet Cables", name: "Cat 7 Ethernet Cables" },
      { id: "Cell Phone OTG Adapters", name: "Cell Phone OTG Adapters" },
      { id: "Computer Adapters", name: "Computer Adapters" },
      { id: "Computer Cables & Interconnects", name: "Computer Cables & Interconnects" },
      { id: "Computer DisplayPort Cables", name: "Computer DisplayPort Cables" },
      { id: "Computer Keyboard & Mouse Combos", name: "Computer Keyboard & Mouse Combos" },
      { id: "Computer Keyboards", name: "Computer Keyboards" },
      { id: "Computer Mice", name: "Computer Mice" },
      { id: "Computer Monitors", name: "Computer Monitors" },
      { id: "Computer Speakers", name: "Computer Speakers" },
      { id: "USB Cables", name: "USB Cables" },
      { id: "USB Flash Drives", name: "USB Flash Drives" },
      { id: "USB Hubs", name: "USB Hubs" },
      { id: "Lightning Cables", name: "Lightning Cables" },
    ],
    asins: [
      {
        id: "B0898BYFSB",
        name: "B0898BYFSB",
        irnId: "Audio & Video Connectors & Adapters",
        peerIds: ["B018GZAHFS", "B07HSY63VQ", "B07THJGZ9Z", "B08KVSHQ8B"],
      },
      {
        id: "B0B8CTN9KW",
        name: "B0B8CTN9KW",
        irnId: "Cat 6 Ethernet Cables",
        peerIds: ["B00AJHC51G", "B007NZGPAY", "B018BCJM52"],
      },
      {
        id: "B0B8K3VD82",
        name: "B0B8K3VD82",
        irnId: "Cat 6 Ethernet Cables",
        peerIds: ["B077H5N5L5", "B0B57PDRS2", "B01IQWGKXE"],
      },
      {
        id: "B074W9T3G7",
        name: "B074W9T3G7",
        irnId: "Cat 6 Ethernet Cables",
        peerIds: ["B00AJHBZ76", "B003EE6HJM", "B00D8N3RNI"],
      },
      {
        id: "B089MGH8T5",
        name: "B089MGH8T5",
        irnId: "Cat 6 Ethernet Cables",
        peerIds: ["B002RB0ZFU", "B004HJC76K", "B0B57RDX6P"],
      },
      {
        id: "B07ZTRR8RP",
        name: "B07ZTRR8RP",
        irnId: "Cat 7 Ethernet Cables",
        peerIds: ["B015DX4SAQ", "B08PL3VQC2", "B08296GPP3"],
      },
      {
        id: "B089MF1LZN",
        name: "B089MF1LZN",
        irnId: "Cat 7 Ethernet Cables",
        peerIds: ["B08LK8HNQ3", "B0BXJ3YBXR", "B00WD017BG", "B00AJHCJGW"],
      },
      {
        id: "B01GGKYXVE",
        name: "B01GGKYXVE",
        irnId: "Cell Phone OTG Adapters",
        peerIds: ["B0842CV8NY", "B012V56C8K", "B01COOQIKU"],
      },
      {
        id: "B081VKWHY2",
        name: "B081VKWHY2",
        irnId: "Computer Adapters",
        peerIds: ["B0893452HR", "B08HYRV34C", "B08HYS5WSS"],
      },
      {
        id: "B08FBJYWTJ",
        name: "B08FBJYWTJ",
        irnId: "Computer Cables & Interconnects",
        peerIds: ["B09DJ7H4ZS", "B098FZTSVN", "B0892G1FCW", "B07GTH548T"],
      },
      {
        id: "B01J8S6X2I",
        name: "B01J8S6X2I",
        irnId: "Computer DisplayPort Cables",
        peerIds: ["B018HIHF4U", "B09ZQLV6CR", "B005H3Q59U", "B078HVDMW2"],
      },
      {
        id: "B015OW3M1W",
        name: "B015OW3M1W",
        irnId: "Computer DisplayPort Cables",
        peerIds: ["B0C4NG33D7", "B07Y1XM998", "B001TUZ6EU"],
      },
      {
        id: "B07WJ5D3H4",
        name: "B07WJ5D3H4",
        irnId: "Computer Keyboards",
        peerIds: ["B0BT15X781", "B003NR874S", "B0BJDPT8V3", "B00JV08TIA", "B07RQVB3HQ"],
      },
      {
        id: "B0787CVBWP",
        name: "B0787CVBWP",
        irnId: "Computer Keyboards",
        peerIds: ["B079JLY5M5", "B07BJ4SJMP", "B07VJXFFJW", "B08LDCSXKL"],
      },
      {
        id: "B078HFRNSP",
        name: "B078HFRNSP",
        irnId: "Computer Mice",
        peerIds: ["B0D2JGKRMM", "B087Z733CM", "B08LW47C2W"],
      },
      {
        id: "B005EJH6RW",
        name: "B005EJH6RW",
        irnId: "Computer Mice",
        peerIds: ["B0CZM4KPZ1", "B012DT5U96", "B003L62T7W", "B09YD8VLN3"],
      },
      {
        id: "B082T62QSC",
        name: "B082T62QSC",
        irnId: "Lightning Cables",
        peerIds: ["B0B1NR7937", "B07D9C8NP2", "B07D999V5P"],
      },
      {
        id: "B082T6DGFY",
        name: "B082T6DGFY",
        irnId: "Lightning Cables",
        peerIds: ["B086H3M59C", "B071WQ2QT", "B09HBYLMPB", "B092Q1LT3S"],
      },
    ],
  })

  // Metrics data from additional files
  const [metricsData, setMetricsData] = useState({
    customerReviews: {}, // { asinId: averageRating }
    competitorSkus: {}, // { asinId: price/data }
    topOfSearch: {}, // { asinId: ranking/percentage }
  })

  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataSource, setDataSource] = useState("fallback") // "fallback", "file", or "error"
  const [fileError, setFileError] = useState(null)

  // File status tracking
  const [fileStatus, setFileStatus] = useState({
    main: "none", // 'none', 'loaded', 'error'
    customerReviews: "none",
    competitorSkus: "none",
    topOfSearch: "none",
  })

  const [selectedIRN, setSelectedIRN] = useState("all")
  const [selectedASIN, setSelectedASIN] = useState("all")
  const [selectedPeers, setSelectedPeers] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false)

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState({
    main: null,
    customerReviews: null,
    competitorSkus: null,
    topOfSearch: null,
  })

  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState("all")
  const [selectedSourceFilter, setSelectedSourceFilter] = useState("all")
  const [selectedPeerFilter, setSelectedPeerFilter] = useState("all")
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState("all")

  // --- Load Product Data (start with fallback only) ---
  useEffect(() => {
    // Start with fallback data immediately - no file loading attempts
    setIsLoadingData(false)
    setDataSource("fallback")
    console.log(
      `📊 Dashboard ready with built-in data: ${productData.irns.length} IRNs, ${productData.asins.length} ASINs`,
    )
  }, [])

  // --- Load Saved Filters ---
  useEffect(() => {
    const savedIRN = localStorage.getItem("selectedIRN")
    const savedASIN = localStorage.getItem("selectedASIN")
    const savedPeers = localStorage.getItem("selectedPeers")
    const savedPriority = localStorage.getItem("priorityFilter")

    if (savedIRN) setSelectedIRN(savedIRN)
    if (savedASIN) setSelectedASIN(savedASIN)
    if (savedPeers) setSelectedPeers(savedPeers)
    if (savedPriority) setPriorityFilter(savedPriority)
  }, [])

  // --- Save Filters ---
  useEffect(() => {
    localStorage.setItem("selectedIRN", selectedIRN)
    localStorage.setItem("selectedASIN", selectedASIN)
    localStorage.setItem("selectedPeers", selectedPeers)
    localStorage.setItem("priorityFilter", priorityFilter)
  }, [selectedIRN, selectedASIN, selectedPeers, priorityFilter])

  // --- File Processing Functions ---
  const handleFileChange = (fileType, e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [fileType]: e.target.files[0],
      }))
    }
  }

  const processMetricsFile = async (file, fileType) => {
    const fileContent = await file.text()
    let data

    // Try JSON first, then CSV
    try {
      data = JSON.parse(fileContent)
    } catch {
      // If not JSON, try parsing as CSV
      const lines = fileContent.split("\n").filter((line) => line.trim())
      if (lines.length < 2) {
        throw new Error("File appears to be empty or has insufficient data")
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/['"]/g, ""))
      data = {}

      // Look for ASIN column and value column
      const asinIndex = headers.findIndex((h) => h.toLowerCase().includes("asin") || h.toLowerCase().includes("id"))

      let valueIndex = -1
      if (fileType === "customerReviews") {
        valueIndex = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("rating") || h.toLowerCase().includes("star") || h.toLowerCase().includes("score"),
        )
      } else if (fileType === "competitorSkus") {
        valueIndex = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("price") || h.toLowerCase().includes("asp") || h.toLowerCase().includes("cost"),
        )
      } else if (fileType === "topOfSearch") {
        valueIndex = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("search") ||
            h.toLowerCase().includes("rank") ||
            h.toLowerCase().includes("position") ||
            h.toLowerCase().includes("tos"),
        )
      }

      // If specific columns not found, use first two columns
      let asinIdx = -1
      let valueIdx = -1
      if (asinIdx === -1) asinIdx = 0
      if (valueIdx === -1) valueIdx = 1

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/['"]/g, ""))
        const asin = values[asinIdx]
        const value = Number.parseFloat(values[valueIdx]) || values[valueIdx]
        if (asin && value !== undefined && value !== "") {
          data[asin] = value
        }
      }
    }

    return data
  }

  const handleIntegrationSubmit = async () => {
    setIsLoading(true)
    const newFileStatus = { ...fileStatus }

    try {
      // Process main product data file
      if (selectedFiles.main) {
        try {
          const fileContent = await selectedFiles.main.text()
          const data = JSON.parse(fileContent)

          if (!data.irns || !data.asins || !Array.isArray(data.irns) || !Array.isArray(data.asins)) {
            throw new Error('Invalid main file format. Expected JSON with "irns" and "asins" arrays.')
          }

          setProductData(data)
          setDataSource("file")
          newFileStatus.main = "loaded"

          // Reset selections
          setSelectedIRN("all")
          setSelectedASIN("all")
          setSelectedPeers("all")

          console.log(`✅ Main data file loaded: ${data.irns.length} IRNs, ${data.asins.length} ASINs`)
        } catch (error) {
          newFileStatus.main = "error"
          console.error("Main file error:", error)
        }
      }

      // Process metrics files
      const newMetricsData = { ...metricsData }

      if (selectedFiles.customerReviews) {
        try {
          newMetricsData.customerReviews = await processMetricsFile(selectedFiles.customerReviews, "customerReviews")
          newFileStatus.customerReviews = "loaded"
          console.log(`✅ Customer reviews loaded: ${Object.keys(newMetricsData.customerReviews).length} ASINs`)
        } catch (error) {
          newFileStatus.customerReviews = "error"
          console.error("Customer reviews file error:", error)
        }
      }

      if (selectedFiles.competitorSkus) {
        try {
          newMetricsData.competitorSkus = await processMetricsFile(selectedFiles.competitorSkus, "competitorSkus")
          newFileStatus.competitorSkus = "loaded"
          console.log(`✅ Competitor SKUs data loaded: ${Object.keys(newMetricsData.competitorSkus).length} ASINs`)
        } catch (error) {
          newFileStatus.competitorSkus = "error"
          console.error("Competitor SKUs file error:", error)
        }
      }

      if (selectedFiles.topOfSearch) {
        try {
          newMetricsData.topOfSearch = await processMetricsFile(selectedFiles.topOfSearch, "topOfSearch")
          newFileStatus.topOfSearch = "loaded"
          console.log(`✅ Top of Search data loaded: ${Object.keys(newMetricsData.topOfSearch).length} ASINs`)
        } catch (error) {
          newFileStatus.topOfSearch = "error"
          console.error("Top of Search file error:", error)
        }
      }

      setMetricsData(newMetricsData)
      setFileStatus(newFileStatus)

      // Success message
      const uploadedFiles = Object.values(selectedFiles).filter((f) => f).length
      const successfulUploads = Object.values(newFileStatus).filter((s) => s === "loaded").length

      if (uploadedFiles > 0) {
        alert(`Integration completed!\n${successfulUploads}/${uploadedFiles} files processed successfully.`)
      }
    } catch (error) {
      console.error("Integration error:", error)
      alert(`Integration failed: ${error.message}`)
    } finally {
      setIsLoading(false)
      setIsIntegrationDialogOpen(false)
      setSelectedFiles({ main: null, customerReviews: null, competitorSkus: null, topOfSearch: null })
      setApiKey("")
    }
  }

  // --- Calculate Metrics with Real Data ---
  const calculateRealMetrics = () => {
    const filteredASINs = getFilteredASINs()
    let avgRating = 4.3
    let avgASP = 25.75
    let avgTOS = 7

    if (filteredASINs.length > 0) {
      // Calculate average rating from real data if available
      const ratingsWithData = filteredASINs.filter((asin) => metricsData.customerReviews[asin.id])
      if (ratingsWithData.length > 0) {
        const totalRating = ratingsWithData.reduce(
          (sum, asin) => sum + Number.parseFloat(metricsData.customerReviews[asin.id]),
          0,
        )
        avgRating = totalRating / ratingsWithData.length
      }

      // Calculate average ASP from real data if available
      const aspWithData = filteredASINs.filter((asin) => metricsData.competitorSkus[asin.id])
      if (aspWithData.length > 0) {
        const totalASP = aspWithData.reduce((sum, asin) => sum + Number.parseFloat(metricsData.competitorSkus[asin.id]), 0)
        avgASP = totalASP / aspWithData.length
      }

      // Calculate average Top of Search from real data if available
      const tosWithData = filteredASINs.filter((asin) => metricsData.topOfSearch[asin.id])
      if (tosWithData.length > 0) {
        const totalTOS = tosWithData.reduce((sum, asin) => sum + Number.parseFloat(metricsData.topOfSearch[asin.id]), 0)
        avgTOS = totalTOS / tosWithData.length
      }
    }

    return { avgRating, avgASP, avgTOS }
  }

  // --- Filtering Logic ---
  // Get available ASINs based on selected IRN
  const getFilteredASINs = () => {
    if (!selectedIRN || selectedIRN === "all") return productData.asins
    return productData.asins.filter((asin) => asin.irnId === selectedIRN)
  }

  // Get available peers based on selected ASIN
  const getAvailablePeers = () => {
    if (!selectedASIN || selectedASIN === "all") return []
    const asin = productData.asins.find((a) => a.id === selectedASIN)
    return asin ? asin.peerIds : []
  }

  // Handle IRN selection
  const handleIRNChange = (irnId) => {
    setSelectedIRN(irnId)

    // Clear ASIN if it doesn't belong to the new IRN
    if (selectedASIN && selectedASIN !== "all") {
      const asin = productData.asins.find((a) => a.id === selectedASIN)
      if (asin && asin.irnId !== irnId && irnId !== "all") {
        setSelectedASIN("all")
      }
    }
  }

  // Handle ASIN selection
  const handleASINChange = (asinId) => {
    setSelectedASIN(asinId)

    // Auto-select the IRN if ASIN is selected
    if (asinId && asinId !== "all") {
      const asin = productData.asins.find((a) => a.id === asinId)
      if (asin && asin.irnId !== selectedIRN) {
        setSelectedIRN(asin.irnId)
      }
    }
  }

  // --- Filter Recommendations ---
  const filteredRecommendations = mockFeatureRecommendations.filter(
    (rec) => priorityFilter === "all" || rec.priority === priorityFilter,
  )

  // --- Helper Functions ---
  const getPriorityColor = (priority) => {
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "add":
        return <span className="text-green-600">✅</span>
      case "improve":
        return <span className="text-yellow-600">⚠️</span>
      case "remove":
        return <span className="text-red-600">❌</span>
      default:
        return <span>💡</span>
    }
  }

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.6) return "text-green-600"
    if (sentiment > 0.2) return "text-yellow-600"
    return "text-red-600"
  }

  const resetFilters = () => {
    setSelectedIRN("all")
    setSelectedASIN("all")
    setSelectedPeers("all")
    setPriorityFilter("all")
    setSelectedSourceFilter("all")
    setSelectedPeerFilter("all")
    setSelectedSentimentFilter("all")
    localStorage.removeItem("selectedIRN")
    localStorage.removeItem("selectedASIN")
    localStorage.removeItem("selectedPeers")
    localStorage.removeItem("priorityFilter")
  }

  const runAnalysis = async (e) => {
    e.preventDefault()

    // Determine what we're analyzing
    const analysisScope =
      selectedIRN && selectedIRN !== "all"
        ? selectedASIN && selectedASIN !== "all"
          ? `specific ASIN ${selectedASIN} in ${selectedIRN}`
          : `all ASINs in ${selectedIRN} (${filteredASINs.length} ASINs)`
        : "all products"

    console.log("Running analysis with filters:", {
      selectedIRN,
      selectedASIN,
      selectedPeers,
      analysisScope,
      availablePeers: getAvailablePeers(),
      filteredASINs: getFilteredASINs().length,
    })

    try {
      const res = await fetch("/api/bedrock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Analyze data for: ${analysisScope}. Peer group: ${selectedPeers}`,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch Bedrock response")
      }

      const data = await res.json()
      console.log(data)
    } catch (error) {
      console.error("Error running analysis:", error)
    }
  }

  // Get current selection info for display
  const selectedIRNInfo =
    selectedIRN && selectedIRN !== "all" ? productData.irns.find((irn) => irn.id === selectedIRN) : null
  const selectedASINInfo =
    selectedASIN && selectedASIN !== "all" ? productData.asins.find((asin) => asin.id === selectedASIN) : null
  const filteredASINs = getFilteredASINs()
  const realMetrics = calculateRealMetrics()

  // Show loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-500">Initializing with sample data</p>
          <div className="mt-2 text-xs text-gray-400">
            Ready to use • Upload your JSON file via "Add Integration" for custom data
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Insights Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered customer feedback analysis for product development</p>

              {/* Data Source Info */}
              <div className="mt-2 text-xs text-gray-500">
                <div className="inline-flex items-center flex-wrap gap-x-4 gap-y-1">
                  <span className="inline-flex items-center">
                    <span className="mr-1">📁</span>
                    Product Data:
                    {dataSource === "file" ? (
                      <span className="ml-1 text-green-600 font-medium">
                        ✅ Custom ({productData.irns.length} IRNs, {productData.asins.length} ASINs)
                      </span>
                    ) : (
                      <span className="ml-1 font-medium">
                        Built-in ({productData.irns.length} IRNs, {productData.asins.length} ASINs)
                      </span>
                    )}
                  </span>

                  {/* Metrics Files Status */}
                  <span className="inline-flex items-center">
                    <span className="mr-1">⭐</span>
                    {fileStatus.customerReviews === "loaded" ? (
                      <span className="text-green-600 font-medium">✅ Reviews</span>
                    ) : (
                      <span className="text-gray-400">Mock Reviews</span>
                    )}
                  </span>

                  <span className="inline-flex items-center">
                    <span className="mr-1">💰</span>
                    {fileStatus.competitorSkus === "loaded" ? (
                      <span className="text-green-600 font-medium">✅ ASINs</span>
                    ) : (
                      <span className="text-gray-400">Mock ASINs</span>
                    )}
                  </span>

                  <span className="inline-flex items-center">
                    <span className="mr-1">🔍</span>
                    {fileStatus.topOfSearch === "loaded" ? (
                      <span className="text-green-600 font-medium">✅ ToS</span>
                    ) : (
                      <span className="text-gray-400">Mock ToS</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Display current selection */}
              {selectedIRNInfo && selectedIRN !== "all" && (
                <div className="mt-2 text-sm text-blue-600">
                  <span className="font-medium">Current Selection:</span> {selectedIRNInfo.name}
                  {selectedASINInfo && selectedASIN !== "all" && <span> → {selectedASINInfo.id}</span>}
                  <span className="text-gray-500 ml-2">({filteredASINs.length} ASINs available)</span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Dialog open={isIntegrationDialogOpen} onOpenChange={setIsIntegrationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <span className="mr-2">🗄️</span>
                    Add Integration
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Data Integration</DialogTitle>
                    <DialogDescription>
                      Upload your data files to populate the dashboard with real metrics and insights.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {/* Main Product Data File */}
                    <div className="grid gap-2">
                      <Label htmlFor="main-file" className="text-sm font-medium">
                        🏷️ Product Data File (irn_asin_cmt.json)
                      </Label>
                      <Input
                        id="main-file"
                        type="file"
                        accept=".json"
                        onChange={(e) => handleFileChange("main", e)}
                        className="text-sm"
                      />
                      {selectedFiles.main && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          📁 Selected: {selectedFiles.main.name} ({(selectedFiles.main.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                      <p className="text-xs text-gray-500">JSON file containing IRNs, ASINs, and peer relationships.</p>
                    </div>

                    {/* Customer Reviews File */}
                    <div className="grid gap-2">
                      <Label htmlFor="reviews-file" className="text-sm font-medium">
                        ⭐ Customer Reviews File
                      </Label>
                      <Input
                        id="reviews-file"
                        type="file"
                        accept=".json,.csv,.xlsx,.xls"
                        onChange={(e) => handleFileChange("customerReviews", e)}
                        className="text-sm"
                      />
                      {selectedFiles.customerReviews && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          📁 Selected: {selectedFiles.customerReviews.name} (
                          {(selectedFiles.customerReviews.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Customer reviews file with ratings data (CSV/JSON/Excel formats supported)
                      </p>
                    </div>

                    {/* Competitor SKUs File */}
                    <div className="grid gap-2">
                      <Label htmlFor="asins-file" className="text-sm font-medium">
                        💰 Competitor SKU Data
                      </Label>
                      <Input
                        id="asins-file"
                        type="file"
                        accept=".json,.csv,.xlsx,.xls"
                        onChange={(e) => handleFileChange("competitorSkus", e)}
                        className="text-sm"
                      />
                      {selectedFiles.competitorSkus && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          📁 Selected: {selectedFiles.competitorSkus.name} (
                          {(selectedFiles.competitorSkus.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                      <p className="text-xs text-gray-500">Competitor SKUs file with data fields (pricing, etc.)</p>
                    </div>

                    {/* Top of Search File */}
                    <div className="grid gap-2">
                      <Label htmlFor="tos-file" className="text-sm font-medium">
                        🔍 Top of Search File
                      </Label>
                      <Input
                        id="tos-file"
                        type="file"
                        accept=".json,.csv,.xlsx,.xls"
                        onChange={(e) => handleFileChange("topOfSearch", e)}
                        className="text-sm"
                      />
                      {selectedFiles.topOfSearch && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          📁 Selected: {selectedFiles.topOfSearch.name} (
                          {(selectedFiles.topOfSearch.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                      <p className="text-xs text-gray-500">Top of Search data file with search ranking/position data</p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>

                    {/* API Integration */}
                    <div className="grid gap-2">
                      <Label htmlFor="api-key" className="text-sm font-medium">
                        🔗 API Key
                      </Label>
                      <Input
                        id="api-key"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500">Connect to your data source using an API key.</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsIntegrationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleIntegrationSubmit}
                      disabled={isLoading || (!Object.values(selectedFiles).some((f) => f) && !apiKey)}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <span className="mr-2 animate-spin">⟳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📤</span>
                          {Object.values(selectedFiles).some((f) => f)
                            ? `Upload ${Object.values(selectedFiles).filter((f) => f).length} File(s)`
                            : apiKey
                              ? "Connect API"
                              : "Select Files"}
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>
                <span className="mr-2">🎯</span>
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
              <span className="mr-2">🔍</span>
              Analysis Configuration
            </CardTitle>
            <CardDescription>Select products and configure analysis parameters</CardDescription>
          </CardHeader>
          <CardContent>
            {/* File Upload Success Notification */}
            {(dataSource === "file" || Object.values(fileStatus).some((status) => status === "loaded")) && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Data files loaded successfully</p>
                    <div className="text-xs text-green-600 mt-1 space-y-1">
                      {dataSource === "file" && (
                        <div>
                          • Product data: {productData.irns.length} IRNs, {productData.asins.length} ASINs
                        </div>
                      )}
                      {fileStatus.customerReviews === "loaded" && (
                        <div>• Customer reviews: {Object.keys(metricsData.customerReviews).length} ASINs</div>
                      )}
                      {fileStatus.competitorSkus === "loaded" && (
                        <div>• Competitor SKUs: {Object.keys(metricsData.competitorSkus).length} ASINs</div>
                      )}
                      {fileStatus.topOfSearch === "loaded" && (
                        <div>• Top of Search: {Object.keys(metricsData.topOfSearch).length} ASINs</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* IRN Selection */}
              <Select value={selectedIRN} onValueChange={handleIRNChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select IRN (Product Category)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All IRNs</SelectItem>
                  {productData.irns.length > 0 ? (
                    productData.irns.map((irn) => (
                      <SelectItem key={irn.id} value={irn.id}>
                        {irn.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      No IRNs available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {/* ASIN Selection */}
              <Select value={selectedASIN} onValueChange={handleASINChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ASIN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ASINs</SelectItem>
                  {filteredASINs.length > 0 ? (
                    filteredASINs.map((asin) => (
                      <SelectItem key={asin.id} value={asin.id}>
                        {asin.id}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      {selectedIRN !== "all" ? "No ASINs in selected IRN" : "No ASINs available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {/* Peer Selection */}
              <Select value={selectedPeers} onValueChange={setSelectedPeers}>
                <SelectTrigger>
                  <SelectValue placeholder="Peers: CMT/Wide/Narrow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Peer Group</SelectItem>
                  <SelectItem value="cmt">CMT</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="narrow">Narrow</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={runAnalysis}>
                  <span className="mr-2">📊</span>
                  Run Analysis
                </Button>
                <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
                  <span>🔄</span>
                </Button>
              </div>
            </div>

            {/* Filter Summary */}
            {(selectedIRN && selectedIRN !== "all") ||
            (selectedASIN && selectedASIN !== "all") ||
            (selectedPeers && selectedPeers !== "all") ? (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm">
                  <span className="font-medium text-blue-800">Active Filters:</span>
                  <div className="mt-1 space-y-1">
                    {selectedIRN && selectedIRN !== "all" && (
                      <div className="text-blue-700">
                        <span className="font-medium">IRN:</span> {selectedIRNInfo?.name}
                        {selectedASIN === "all" && (
                          <span className="text-blue-600 ml-2">({filteredASINs.length} ASINs included)</span>
                        )}
                      </div>
                    )}
                    {selectedASIN && selectedASIN !== "all" && (
                      <div className="text-blue-700">
                        <span className="font-medium">ASIN:</span> {selectedASIN}
                      </div>
                    )}
                    {selectedPeers && selectedPeers !== "all" && (
                      <div className="text-blue-700">
                        <span className="font-medium">Peer Group:</span> {selectedPeers.toUpperCase()}
                      </div>
                    )}
                    {selectedASIN && selectedASIN !== "all" && (
                      <div className="text-blue-600">
                        <span className="font-medium">Available Peers:</span> {getAvailablePeers().length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Star Ratings</p>
                  <p className="text-2xl font-bold text-green-600">{realMetrics.avgRating.toFixed(1)}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">👍</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {fileStatus.customerReviews === "loaded"
                  ? `From ${Object.keys(metricsData.customerReviews).length} ASINs`
                  : "↗ vs 4.5 across 15 peers"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ASP</p>
                  <p className="text-2xl font-bold text-blue-600">${realMetrics.avgASP.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">💬</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {fileStatus.competitorSkus === "loaded"
                  ? `From ${Object.keys(metricsData.competitorSkus).length} ASINs`
                  : "vs $21.5 across 9 Peers"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Of Search</p>
                  <p className="text-2xl font-bold text-red-600">{realMetrics.avgTOS.toFixed(0)}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {fileStatus.topOfSearch === "loaded"
                  ? `From ${Object.keys(metricsData.topOfSearch).length} ASINs`
                  : "vs 10 TOS ASINs by Anker"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Potential iOPS</p>
                  <p className="text-2xl font-bold text-green-600">$12.4M</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">From 7 feature additions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">Feature Recommendations</TabsTrigger>
            <TabsTrigger value="peer-comparison">Peer Comparison (Output)</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="cost-benefit">Cost-Benefit Analysis</TabsTrigger>
            <TabsTrigger value="voice-customer">Voice of Customer</TabsTrigger>
          </TabsList>

          {/* Feature Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">💡</span>
                  AI-Powered Feature Recommendations
                </CardTitle>
                <CardDescription>
                  Based on analysis of{" "}
                  {selectedIRN && selectedIRN !== "all" ? `${selectedIRNInfo?.name}` : "all products"}
                  {selectedASIN && selectedASIN !== "all"
                    ? ` (ASIN: ${selectedASIN})`
                    : selectedIRN && selectedIRN !== "all"
                      ? ` (${filteredASINs.length} ASINs)`
                      : ""}
                </CardDescription>
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
                          <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                          <Badge variant="outline">{rec.confidence}% confidence</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Incremental Revenue</p>
                          <p className="text-lg font-bold text-green-600">$3.5M/year</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Peers adoption</p>
                          <p className="text-lg font-bold text-blue-600">{rec.mentions}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Est. Cost</p>
                          <p className="text-lg font-bold text-orange-600">{rec.costEstimate}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">ROI</p>
                          <p className="text-lg font-bold text-green-600">{rec.impact}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex items-start">
                          <span className="text-blue-400 mr-3 text-lg">💬</span>
                          <div>
                            <p className="text-sm font-medium text-blue-800">Customer Voice</p>
                            <p className="text-sm text-blue-700 italic">"{rec.customerQuote}"</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <span className="mr-2">👁️</span>
                          View Details
                        </Button>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <span className="mr-2">❌</span>
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <span className="mr-2">✅</span>
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

          {/* Other tabs abbreviated for space */}
          <TabsContent value="peer-comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Peer Comparison Analysis</CardTitle>
                <CardDescription>
                  Feature adoption rates across peer groups - comparing our products against competitors
                  {selectedASIN && selectedASIN !== "all"
                    ? ` (ASIN: ${selectedASIN})`
                    : selectedIRN && selectedIRN !== "all"
                      ? ` (${filteredASINs.length} ASINs)`
                      : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Our Product</th>
                        <th className="text-center p-4 font-semibold">CMT Peers</th>
                        <th className="text-center p-4 font-semibold">Wide Peers</th>
                        <th className="text-center p-4 font-semibold">Narrow Peers</th>
                        <th className="text-center p-4 font-semibold">ALL Peers</th>
                        <th className="text-center p-4 font-semibold">Gap Analysis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockFeatureRecommendations.map((rec) => {
                        // Calculate peer adoption rates
                        const ourHasFeature = rec.type !== "add" // We have it if we're not adding it
                        const cmtAdoption = rec.feature === "Active Noise Cancellation" ? "100%" : 
                                          rec.feature === "Wireless Charging Case" ? "67%" :
                                          rec.feature === "Touch Controls" ? "83%" : "33%"
                        const wideAdoption = rec.feature === "Active Noise Cancellation" ? "67%" :
                                           rec.feature === "Wireless Charging Case" ? "0%" :
                                           rec.feature === "Touch Controls" ? "67%" : "33%"
                        const narrowAdoption = rec.feature === "Active Noise Cancellation" ? "67%" :
                                             rec.feature === "Wireless Charging Case" ? "33%" :
                                             rec.feature === "Touch Controls" ? "100%" : "0%"
                        
                        // ALL Peers adoption should match the "mentions" from Feature Recommendations
                        const allPeersAdoption = typeof rec.mentions === 'string' && rec.mentions.includes('%') 
                          ? rec.mentions 
                          : `${Math.round((parseInt(rec.mentions) / 20))}%` // Convert mentions count to percentage
                        
                        const gapExists = (rec.type === "add" && parseFloat(allPeersAdoption) > 50) || 
                                        (rec.type === "remove" && parseFloat(allPeersAdoption) < 30)
                        
                        return (
                          <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(rec.type)}
                                <span className="font-medium">{rec.feature}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center">
                                {ourHasFeature ? (
                                  <span className="text-green-600 text-xl">✅</span>
                                ) : (
                                  <span className="text-red-600 text-xl">❌</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {cmtAdoption}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                {wideAdoption}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                {narrowAdoption}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 font-bold">
                                {allPeersAdoption}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              {gapExists ? (
                                <div className="flex items-center justify-center space-x-1">
                                  <span className="text-red-600 text-lg">⚠️</span>
                                  <span className="text-sm font-medium text-red-600">
                                    {rec.type === "add" ? "Behind" : "Ahead"}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center space-x-1">
                                  <span className="text-green-600 text-lg">✅</span>
                                  <span className="text-sm font-medium text-green-600">Aligned</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Features Behind Peers</p>
                          <p className="text-2xl font-bold text-red-600">2</p>
                        </div>
                        <span className="text-red-600 text-2xl">⚠️</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Features Ahead of Peers</p>
                          <p className="text-2xl font-bold text-green-600">1</p>
                        </div>
                        <span className="text-green-600 text-2xl">🏆</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Competitive advantages</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Market Aligned Features</p>
                          <p className="text-2xl font-bold text-blue-600">1</p>
                        </div>
                        <span className="text-blue-600 text-2xl">🎯</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Well positioned</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Legend */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">CMT</Badge>
                      <span className="text-gray-600">Close Match Targets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Wide</Badge>
                      <span className="text-gray-600">Wide Peer Group</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Narrow</Badge>
                      <span className="text-gray-600">Narrow Peer Group</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 font-bold">ALL</Badge>
                      <span className="text-gray-600">All Peers Combined</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                      <SelectItem value="competitor-sku">Competitor SKU</SelectItem>
                      <SelectItem value="cmts">CMTs</SelectItem>
                      <SelectItem value="wide-peers">Wide Peers</SelectItem>
                      <SelectItem value="narrow-peers">Narrow Peers</SelectItem>
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
                  <CardTitle>Customer Mention Trends Over Time</CardTitle>
                  <CardDescription>
                    Count of customers mentioning features by month
                    {selectedSentimentFilter !== "all" && (
                      <span className="ml-2 text-blue-600">
                        (Filtered by: {selectedSentimentFilter.replace("-", " ").toUpperCase()})
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomerMentionChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                        <th className="text-left p-3">iOPS/Year</th>
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

          <TabsContent value="voice-customer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice of Customer Insights</CardTitle>
                <CardDescription>Direct customer feedback filtered by your selections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                        <SelectItem value="competitor-sku">Competitor SKU</SelectItem>
                        <SelectItem value="cmts">CMTs</SelectItem>
                        <SelectItem value="wide-peers">Wide Peers</SelectItem>
                        <SelectItem value="narrow-peers">Narrow Peers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="irn-filter" className="text-sm font-medium mb-2 block">
                      Filter by IRN
                    </Label>
                    <Select value={selectedIRN} onValueChange={setSelectedIRN}>
                      <SelectTrigger>
                        <SelectValue placeholder="All IRNs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All IRNs</SelectItem>
                        {productData.irns.length > 0 ? (
                          productData.irns.map((irn) => (
                            <SelectItem key={irn.id} value={irn.id}>
                              {irn.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No IRNs available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Summary */}
                {(selectedSourceFilter && selectedSourceFilter !== "all") || (selectedIRN && selectedIRN !== "all") ? (
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm">
                      <span className="font-medium text-blue-800">Active Filters:</span>
                      <div className="mt-1 space-y-1">
                        {selectedSourceFilter && selectedSourceFilter !== "all" && (
                          <div className="text-blue-700">
                            <span className="font-medium">Source:</span>{" "}
                            {selectedSourceFilter.replace("-", " ").toUpperCase()}
                          </div>
                        )}
                        {selectedIRN && selectedIRN !== "all" && (
                          <div className="text-blue-700">
                            <span className="font-medium">IRN:</span> {selectedIRNInfo?.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-600 flex items-center">
                      <span className="mr-2">👍</span>
                      Positive Feedback
                      {(selectedSourceFilter !== "all" || selectedIRN !== "all") && (
                        <span className="ml-2 text-sm text-blue-600">
                          (Filtered by:{" "}
                          {selectedSourceFilter !== "all" ? selectedSourceFilter.replace("-", " ").toUpperCase() : ""}
                          {selectedSourceFilter !== "all" && selectedIRN !== "all" ? " & " : ""}
                          {selectedIRN !== "all" ? selectedIRNInfo?.name : ""})
                        </span>
                      )}
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
                      <span className="mr-2">👎</span>
                      Areas for Improvement
                      {(selectedSourceFilter !== "all" || selectedIRN !== "all") && (
                        <span className="ml-2 text-sm text-blue-600">
                          (Filtered by:{" "}
                          {selectedSourceFilter !== "all" ? selectedSourceFilter.replace("-", " ").toUpperCase() : ""}
                          {selectedSourceFilter !== "all" && selectedIRN !== "all" ? " & " : ""}
                          {selectedIRN !== "all" ? selectedIRNInfo?.name : ""})
                        </span>
                      )}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
