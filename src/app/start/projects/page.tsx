import { ProjectsForm } from "@/components/projects-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24"
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
        <div className="container py-12 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-headline">
                  Step 3: Describe Your Projects
                </CardTitle>
                <CardDescription className="font-body space-y-4 pt-2">
                  <p>
                    Now, let's talk about what you've built. This helps our AI understand your practical experience.
                  </p>
                  <p>
                    Describe any personal, academic, or professional projects you've worked on. The more detail you provide, the better our AI can tailor your career suggestions.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
