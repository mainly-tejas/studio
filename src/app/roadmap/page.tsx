"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Circle,
  Briefcase,
  BookOpen,
  Loader2,
  ArrowLeft,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react";
import type { CareerSuggestionOutput } from "@/ai/flows/career-suggestion";
import { ChatAssistant } from "@/components/chat-assistant";
import { AdaptiveQuiz } from "@/components/adaptive-quiz";
import { generateRoadmap, GenerateRoadmapOutput } from "@/ai/flows/roadmap-generation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CareerSuggestion = CareerSuggestionOutput[0];

export default function RoadmapPage() {
  const [career, setCareer] = useState<CareerSuggestion | null>(null);
  const [background, setBackground] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<GenerateRoadmapOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedCareer = localStorage.getItem("selectedCareer");
    const storedBackground = localStorage.getItem("userBackground");

    if (storedCareer && storedBackground) {
      const parsedCareer = JSON.parse(storedCareer);
      const parsedBackground = JSON.parse(storedBackground);
      setCareer(parsedCareer);
      setBackground(parsedBackground);

      generateRoadmap({
        career: parsedCareer.career,
        background: JSON.stringify(parsedBackground, null, 2),
      })
        .then((generatedRoadmap) => {
          setRoadmap(generatedRoadmap);
        })
        .catch((err) => {
          console.error("Failed to generate roadmap:", err);
          setError("Could not generate a personalized roadmap. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      router.push("/start");
    }
  }, [router]);

  const handleRoadmapUpdate = (newRoadmapString: string) => {
    try {
      // Attempt to parse it as a structured roadmap first
      const newRoadmap = JSON.parse(newRoadmapString);
      if (Array.isArray(newRoadmap.phases)) {
        setRoadmap(newRoadmap);
      } else {
        // If it's not structured, display it as raw text
        setRoadmap({ raw: newRoadmapString, phases: [] });
      }
    } catch (e) {
      // If parsing fails, it's likely a raw string response
      setRoadmap({ raw: newRoadmapString, phases: [] });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-headline">Crafting your personalized roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col min-h-screen items-center justify-center bg-background gap-4">
        <p className="text-destructive">{error}</p>
        <Button asChild>
            <Link href="/careers">Go Back</Link>
        </Button>
      </div>
    )
  }

  if (!career || !background || !roadmap) {
    return null;
  }
  
  const roadmapString = JSON.stringify(roadmap, null, 2);
  const hasPhases = roadmap && Array.isArray(roadmap.phases) && roadmap.phases.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link href="/careers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold font-headline">
              Your Roadmap to Becoming a {career.career}
            </h1>
          </div>
          <AdaptiveQuiz
            background={JSON.stringify(background)}
            onRoadmapUpdate={handleRoadmapUpdate}
          />
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {hasPhases ? (
            roadmap.phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="relative pl-8 sm:pl-12 py-6 group">
                <div className="absolute top-0 left-4 sm:left-6 w-px h-full bg-border group-last:h-[calc(100%-4rem)]"></div>
                <div className="absolute top-5 left-[-0.1rem] sm:left-[0.35rem] w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {phaseIndex + 1}
                </div>
                <h2 className="font-bold text-2xl mb-4 font-headline">
                  {phase.title}
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-6">
                   {phase.modules.map((module, moduleIndex) => (
                      <Card key={moduleIndex} className="ml-4 sm:ml-6">
                        <AccordionItem value={`item-${moduleIndex}`} className="border-b-0">
                          <AccordionTrigger className="p-6 hover:no-underline">
                              <CardTitle className="font-headline text-xl text-left">
                                {module.title}
                              </CardTitle>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <CalendarDays className="w-4 h-4 text-accent" />
                                  Weekly Goals / Daily Tasks
                                </h4>
                                <ul className="list-none space-y-1 pl-6">
                                  {module.tasks.map((task, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <Circle className="w-2 h-2 fill-current mt-1.5 shrink-0" />
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-accent" />
                                  Curated Resources
                                </h4>
                                 <ul className="list-none space-y-1 pl-6">
                                  {module.resources.map((res, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <Circle className="w-2 h-2 fill-current mt-1.5 shrink-0" />
                                      <span>{res}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <ClipboardCheck className="w-4 h-4 text-accent" />
                                  Measurable Checkpoint
                                </h4>
                                <p className="pl-6 text-muted-foreground">
                                  {module.checkpoint}
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                   ))}
                </Accordion>
              </div>
            ))
          ) : (
             <Card>
              <CardHeader>
                <CardTitle>Updated Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-code text-sm">
                  {roadmap.raw || "No roadmap details available."}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <ChatAssistant
        roadmap={roadmapString}
        background={JSON.stringify(background)}
      />
    </div>
  );
}
