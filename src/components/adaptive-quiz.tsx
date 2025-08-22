"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adaptiveRoadmap } from "@/ai/flows/adaptive-roadmap";
import { Card, CardContent } from "@/components/ui/card";

interface AdaptiveQuizProps {
  background: string;
  onRoadmapUpdate: (newRoadmap: string) => void;
}

const quizQuestions = [
  {
    question: "How would you rate your confidence in Python programming?",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  {
    question:
      "Have you ever deployed a web application to a cloud provider like AWS, GCP, or Azure?",
    options: [
      "Never",
      "Once or twice with a tutorial",
      "Multiple times",
      "I do it regularly",
    ],
  },
  {
    question: "How familiar are you with database concepts like SQL and NoSQL?",
    options: [
      "Not familiar at all",
      "I know the basics",
      "I'm comfortable with both",
      "I can design and optimize complex databases",
    ],
  },
];

export function AdaptiveQuiz({ background, onRoadmapUpdate }: AdaptiveQuizProps) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quizQuestions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
      });
      return;
    }

    setLoading(true);
    const quizResults = quizQuestions
      .map((q, i) => `${q.question}: ${answers[i]}`)
      .join("\n");

    try {
      const result = await adaptiveRoadmap({ background, quizResults });
      onRoadmapUpdate(result.adjustedRoadmap);
      toast({
        title: "Roadmap Updated!",
        description: "Your roadmap has been adjusted based on your quiz results.",
      });
      setOpen(false);
      setAnswers({});
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to update your roadmap. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Lightbulb className="mr-2 h-4 w-4" />
          Refine Your Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Adaptive Quiz
          </DialogTitle>
          <DialogDescription className="font-body">
            Answer these questions to help us fine-tune your learning path.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto px-1">
          {quizQuestions.map((q, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p className="font-semibold mb-4 font-body">
                  {index + 1}. {q.question}
                </p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                >
                  <div className="space-y-2">
                    {q.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`q${index}-${option}`}
                        />
                        <Label
                          htmlFor={`q${index}-${option}`}
                          className="font-body"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update My Roadmap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
