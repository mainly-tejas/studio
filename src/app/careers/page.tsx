"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart,
  Lightbulb,
  Briefcase,
  DollarSign,
  Loader2,
} from "lucide-react";
import type { CareerSuggestionOutput } from "@/ai/flows/career-suggestion";

type CareerSuggestion = CareerSuggestionOutput[0];

export default function CareersPage() {
  const [suggestions, setSuggestions] = useState<CareerSuggestion[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedSuggestions = localStorage.getItem("careerSuggestions");
      if (storedSuggestions) {
        setSuggestions(JSON.parse(storedSuggestions));
      } else {
        router.push("/start");
      }
    } catch (error) {
      console.error(
        "Failed to parse career suggestions from localStorage",
        error
      );
      router.push("/start");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSelectCareer = (career: CareerSuggestion) => {
    localStorage.setItem("selectedCareer", JSON.stringify(career));
    router.push("/roadmap");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="m19 19-7-7 7-7" />
            </svg>
            <span className="font-headline">PathFinder AI</span>
          </Link>
          <div className="ml-auto">
            <Button variant="outline" asChild>
              <Link href="/start">Start Over</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter font-headline">
              Your Personalized Career Matches
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-muted-foreground font-body">
              Based on your profile, here are some career paths that could be a
              great fit for you. Explore each option to see a detailed roadmap.
            </p>
          </div>
          {suggestions && suggestions.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-headline">
                        {suggestion.career}
                      </CardTitle>
                      <Badge
                        variant={suggestion.fitScore > 80 ? "default" : "secondary"}
                        className="bg-primary/20 text-primary font-bold"
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        {suggestion.fitScore}% Fit
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 mt-1 text-accent" />
                      <div>
                        <h4 className="font-semibold font-headline">
                          Skill Gaps
                        </h4>
                        <p className="text-sm text-muted-foreground font-body">
                          {suggestion.skillGaps}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 mt-1 text-accent" />
                      <div>
                        <h4 className="font-semibold font-headline">
                          Starter Roles
                        </h4>
                        <p className="text-sm text-muted-foreground font-body">
                          {suggestion.starterRoles}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 mt-1 text-accent" />
                      <div>
                        <h4 className="font-semibold font-headline">
                          Salary Range
                        </h4>
                        <p className="text-sm text-muted-foreground font-body">
                          {suggestion.salaryRange}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleSelectCareer(suggestion)}
                      className="w-full group"
                    >
                      View Roadmap
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">
                No career suggestions found.
              </p>
              <Button asChild className="mt-4">
                <Link href="/start">Try again</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
