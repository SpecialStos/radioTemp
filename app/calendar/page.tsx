"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Define event interface
interface Event {
  id: string
  title: string
  dateString: string // Store as string for simplicity
  time: string
  location: string
  locationUrl: string
  lineup: string[] | null // Can be null if not announced yet
  imageUrl: string
  isWeekly: boolean
}

// Default image for TBA events
const TBA_IMAGE_URL = "/placeholder.svg?height=400&width=600" // Replace with the URL of the provided image

// Create events data
const events: Event[] = [
  // Upcoming events only
  {
    id: "1",
    title: "Weekly Groove Affair",
    dateString: "2025-03-06", // March 6, 2025 (upcoming)
    time: "20:00 - 01:00",
    location: "Mason Bar, Limassol",
    locationUrl: "https://maps.app.goo.gl/57kSkJssPMpn7h5J8",
    lineup: ["El Pablo Rojo", "AKI ANA"],
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/march06.JPG-CdGVI0AGUIu3VRczTrVTskl2V6CEhb.jpeg",
    isWeekly: true,
  },
  {
    id: "2",
    title: "Late Night Electric x disclosure",
    dateString: "2025-03-07", // March 7, 2025 (upcoming)
    time: "21:00 - 02:00",
    location: "Mason Bar, Limassol",
    locationUrl: "https://maps.app.goo.gl/57kSkJssPMpn7h5J8",
    lineup: ["Chris Bodnar", "AXEL", "Jigsaw", "Alex Hleb", "Reskue"],
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/march7.JPG-7TPMeimFdEozCeUwSShSGTI615HjY1.jpeg",
    isWeekly: false,
  },
  {
    id: "3",
    title: "Weekly Groove Affair",
    dateString: "2025-03-13", // March 13, 2025 (upcoming)
    time: "20:00 - 01:00",
    location: "Mason Bar, Limassol",
    locationUrl: "https://maps.app.goo.gl/57kSkJssPMpn7h5J8",
    lineup: null, // No lineup announced yet
    imageUrl: TBA_IMAGE_URL, // Use TBA image
    isWeekly: true,
  },
  {
    id: "4",
    title: "Weekly Groove Affair",
    dateString: "2025-03-20", // March 20, 2025 (upcoming)
    time: "20:00 - 01:00",
    location: "Mason Bar, Limassol",
    locationUrl: "https://maps.app.goo.gl/57kSkJssPMpn7h5J8",
    lineup: ["Chris Bodnar", "Stásia"], // Updated lineup
    imageUrl: "/placeholder.svg?height=400&width=600",
    isWeekly: true,
  },
  {
    id: "5",
    title: "Weekly Groove Affair",
    dateString: "2025-03-27", // March 27, 2025 (upcoming)
    time: "20:00 - 01:00",
    location: "Mason Bar, Limassol",
    locationUrl: "https://maps.app.goo.gl/57kSkJssPMpn7h5J8",
    lineup: null, // No lineup announced yet
    imageUrl: TBA_IMAGE_URL, // Use TBA image
    isWeekly: true,
  },
]

// Format date to display as "DAY MON DDth"
function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString)
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

  const day = days[date.getDay()]
  const month = months[date.getMonth()]

  // Add ordinal suffix to date
  const dateNum = date.getDate()
  let suffix = "th"
  if (dateNum === 1 || dateNum === 21 || dateNum === 31) suffix = "st"
  else if (dateNum === 2 || dateNum === 22) suffix = "nd"
  else if (dateNum === 3 || dateNum === 23) suffix = "rd"

  return `${day} ${month} ${dateNum}${suffix}`
}

export default function CalendarPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])

  useEffect(() => {
    // Use the current date in production
    const today = new Date()

    // Format as YYYY-MM-DD for comparison
    const todayString = today.toISOString().split("T")[0]

    // Filter events
    const upcoming: Event[] = []
    const past: Event[] = []

    events.forEach((event) => {
      if (event.dateString >= todayString) {
        upcoming.push(event)
      } else {
        past.push(event)
      }
    })

    // Sort upcoming events by date (ascending)
    upcoming.sort((a, b) => a.dateString.localeCompare(b.dateString))

    // Sort past events by date (descending)
    past.sort((a, b) => b.dateString.localeCompare(a.dateString))

    // Only keep past events from the current month
    const currentMonth = today.getMonth() + 1 // +1 because months are 0-indexed
    const currentYear = today.getFullYear()
    const currentMonthString = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`

    const filteredPast = past.filter((event) => event.dateString.startsWith(currentMonthString))

    setUpcomingEvents(upcoming)
    setPastEvents(filteredPast)
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold neon-text mb-8 text-center">Events</h1>

      <Tabs defaultValue="upcoming" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="upcoming"
            className="py-2 px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all neon-tab"
          >
            Upcoming Events ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="py-2 px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all neon-tab"
          >
            Past Events ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-8">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events at the moment. Check back soon!
            </div>
          ) : (
            upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-8">
          {pastEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No past events this month.</div>
          ) : (
            pastEvents.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{formatDisplayDate(event.dateString)}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          </div>
          <Link
            href="https://instagram.com/disclosure.cy"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors inline-block text-center"
          >
            RSVP
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-video bg-black/30 rounded-lg overflow-hidden relative">
            <img
              src={event.imageUrl || "/placeholder.svg"}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Time</h3>
                <p className="text-muted-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Location</h3>
                <p className="text-muted-foreground">{event.location}</p>
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  View on map
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Lineup</h3>
                <p className="text-muted-foreground">{event.lineup ? event.lineup.join(", ") : "TO BE ANNOUNCED"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

