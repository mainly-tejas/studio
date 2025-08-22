import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Compass, ListChecks } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

export default function Home() {
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
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Discover Your Perfect Career Path with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body">
                    PathFinder AI uses cutting-edge technology to analyze your
                    skills and interests, suggesting personalized career tracks
                    and building an adaptive roadmap for your success.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/start">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="career path technology"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-body">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  How PathFinder AI Helps You
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                  From personalized suggestions to an ever-adapting learning
                  plan, we provide the tools you need to navigate your career
                  journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center">
                    <Compass className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">
                    Career Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-body text-muted-foreground">
                  Receive AI-driven career options based on your unique
                  background, skills, and interests, complete with fit scores.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center">
                    <ListChecks className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">
                    Adaptive Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-body text-muted-foreground">
                  Get a dynamic, multi-year plan that visualizes your journey,
                  broken down into manageable modules and projects.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">
                    AI Chat Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-body text-muted-foreground">
                  Modify your plan, ask questions, and get instant guidance
                  from our intelligent chat assistant, available 24/7.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 PathFinder AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
