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
} from "lucide-react";
import type { CareerSuggestionOutput } from "@/ai/flows/career-suggestion";
import { ChatAssistant } from "@/components/chat-assistant";
import { AdaptiveQuiz } from "@/components/adaptive-quiz";

type CareerSuggestion = CareerSuggestionOutput[0];

const placeholderRoadmap = {
  phases: [
    {
      title: "Phase 1: Foundations (Months 1-3)",
      modules: [
        {
          title: "Module 1: Core Programming",
          tasks: [
            "Learn Python syntax",
            "Data structures and algorithms",
            "Object-oriented programming",
          ],
          resources: ["freeCodeCamp Python Course", "LeetCode Easy Problems"],
          checkpoint: "Build a command-line application",
        },
        {
          title: "Module 2: Web Basics",
          tasks: ["HTML, CSS, and JavaScript", "DOM manipulation", "Intro to APIs"],
          resources: ["MDN Web Docs", "The Odin Project"],
          checkpoint: "Create a personal portfolio website",
        },
      ],
    },
    {
      title: "Phase 2: Specialization (Months 4-8)",
      modules: [
        {
          title: "Module 3: Backend Development",
          tasks: [
            "Learn a backend framework (e.g., Django, Node.js)",
            "Database management (SQL/NoSQL)",
            "REST API design",
          ],
          resources: ["Django Official Tutorial", "Full Stack Open"],
          checkpoint: "Build a REST API for a simple blog",
        },
        {
          title: "Module 4: Frontend Framework",
          tasks: [
            "Learn React or Vue",
            "State management",
            "Component-based architecture",
          ],
          resources: ["Official React Docs", "Scrimba React Course"],
          checkpoint: "Rebuild portfolio with a frontend framework",
        },
      ],
    },
    {
      title: "Phase 3: Advanced Topics & Job Prep (Months 9-12)",
      modules: [
        {
          title: "Module 5: Project & Portfolio",
          tasks: [
            "Build a full-stack MERN/Djang-React application",
            "Deploy the application",
            "Write comprehensive tests",
          ],
          resources: [
            "Vercel/Netlify for deployment",
            "Jest/Pytest for testing",
          ],
          checkpoint: "A deployed, live full-stack project",
        },
        {
          title: "Module 6: Career Prep",
          tasks: [
            "Resume building",
            "LinkedIn optimization",
            "Behavioral and technical interview prep",
          ],
          resources: ["Pramp for mock interviews", "Tech interview handbook"],
          checkpoint: "Completed 10 mock interviews",
        },
      ],
    },
  ],
};

export default function RoadmapPage() {
  const [career, setCareer] = useState<CareerSuggestion | null>(null);
  const [background, setBackground] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(placeholderRoadmap);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedCareer = localStorage.getItem("selectedCareer");
      const storedBackground = localStorage.getItem("userBackground");
      if (storedCareer && storedBackground) {
        setCareer(JSON.parse(storedCareer));
        setBackground(JSON.parse(storedBackground));
      } else {
        router.push("/start");
      }
    } catch (error) {
      console.error(error);
      router.push("/start");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleRoadmapUpdate = (newRoadmapString: string) => {
    try {
      const newRoadmap = JSON.parse(newRoadmapString);
      setRoadmap(newRoadmap);
    } catch (e) {
      setRoadmap({ raw: newRoadmapString });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!career || !background) {
    return null;
  }

  const roadmapString = JSON.stringify(roadmap, null, 2);

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
          {roadmap.raw ? (
            <Card>
              <CardHeader>
                <CardTitle>Updated Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-code text-sm">
                  {roadmap.raw}
                </pre>
              </CardContent>
            </Card>
          ) : (
            roadmap.phases.map((phase: any, phaseIndex: number) => (
              <div key={phaseIndex} className="relative pl-8 sm:pl-12 py-6 group">
                <div className="absolute top-0 left-4 sm:left-6 w-px h-full bg-border group-last:h-[calc(100%-4rem)]"></div>
                <div className="absolute top-5 left-[-0.1rem] sm:left-[0.35rem] w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {phaseIndex + 1}
                </div>
                <h2 className="font-bold text-2xl mb-4 font-headline">
                  {phase.title}
                </h2>
                <div className="space-y-6">
                  {phase.modules.map((module: any, moduleIndex: number) => (
                    <Card
                      key={moduleIndex}
                      className="ml-4 sm:ml-6 transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <CardTitle className="font-headline">
                          {module.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-accent" />
                            Daily Tasks
                          </h4>
                          <ul className="list-none space-y-1 pl-4">
                            {module.tasks.map((task: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-muted-foreground"
                              >
                                <Circle className="w-2 h-2 fill-current" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-accent" />
                            Curated Resources
                          </h4>
                          <ul className="list-none space-y-1 pl-4">
                            {module.resources.map((res: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-muted-foreground"
                              >
                                <Circle className="w-2 h-2 fill-current" />
                                {res}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-accent" />
                            Measurable Checkpoint
                          </h4>
                          <p className="pl-4 text-muted-foreground">
                            {module.checkpoint}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
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
