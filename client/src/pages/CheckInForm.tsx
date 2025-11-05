import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

const pillarQuestions = [
  {
    key: "pillarSelfAwareness",
    label: "Self-awareness",
    question: "Did I notice my patterns and feelings today?",
  },
  {
    key: "pillarMindset",
    label: "Mindset",
    question: "Did I choose a helpful attitude today?",
  },
  {
    key: "pillarAction",
    label: "Action",
    question: "Did I do what I said I would do?",
  },
  {
    key: "pillarImpact",
    label: "Impact",
    question: "Did I show up in a way that lifted others?",
  },
];

export default function CheckInForm() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    moodScore: 5,
    energyScore: 5,
    stressScore: 5,
    pillarSelfAwareness: 3,
    pillarMindset: 3,
    pillarAction: 3,
    pillarImpact: 3,
    keyWin: "",
    biggestChallenge: "",
    penMoment: "",
  });

  const saveMutation = trpc.checkIn.save.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMutation.mutateAsync(formData);
      // Show success message
      alert("Nice one. Tiny steps, big shifts over time.");
      navigate("/");
    } catch (error) {
      console.error("Error saving check-in:", error);
      alert("Oops, something went wrong. Please try again.");
    }
  };

  const handleSliderChange = (key: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleTextChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value.slice(0, 200),
    }));
  };

  const getPillarFeedback = (score: number) => {
    if (score >= 4) {
      return "Nice. This pillar is working for you today.";
    } else if (score <= 2) {
      return "All good. This is just data, not judgement.";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            How are you leading yourself today?
          </h1>
          <p className="text-slate-600">
            One honest minute. Let's see what's true right now.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood, Energy, Stress */}
          <Card className="p-6 border-0 shadow-sm bg-white">
            <h2 className="text-lg font-semibold text-indigo-900 mb-6">
              How are you right now?
            </h2>

            {/* Mood */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Mood: {formData.moodScore}
                </label>
                <span className="text-xs text-slate-500">1–10</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Overall, how are you feeling today?
              </p>
              <Slider
                value={[formData.moodScore]}
                onValueChange={(value) => handleSliderChange("moodScore", value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Energy */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Energy: {formData.energyScore}
                </label>
                <span className="text-xs text-slate-500">1–10</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Got fuel in the tank or running on fumes?
              </p>
              <Slider
                value={[formData.energyScore]}
                onValueChange={(value) => handleSliderChange("energyScore", value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Stress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Stress: {formData.stressScore}
                </label>
                <span className="text-xs text-slate-500">1–10</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                How much pressure are you under right now?
              </p>
              <Slider
                value={[formData.stressScore]}
                onValueChange={(value) => handleSliderChange("stressScore", value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </Card>

          {/* Pillars */}
          <Card className="p-6 border-0 shadow-sm bg-white">
            <h2 className="text-lg font-semibold text-indigo-900 mb-6">
              Your Four Pillars
            </h2>

            <div className="space-y-8">
              {pillarQuestions.map((pillar) => {
                const value = formData[pillar.key as keyof typeof formData] as number;
                const feedback = getPillarFeedback(value);
                return (
                  <div key={pillar.key}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <label className="text-sm font-semibold text-slate-800">
                          {pillar.label}: {value}
                        </label>
                        <p className="text-xs text-slate-600 mt-1">
                          {pillar.question}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">1–5</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(v) => handleSliderChange(pillar.key, v)}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full mb-2"
                    />
                    {feedback && (
                      <p className="text-xs text-teal-700 font-medium">
                        {feedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Text Inputs */}
          <Card className="p-6 border-0 shadow-sm bg-white">
            <h2 className="text-lg font-semibold text-indigo-900 mb-6">
              Your Story Today
            </h2>

            {/* Today's Win */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Today's win
              </label>
              <p className="text-xs text-slate-500 mb-2">
                What went well? What are you proud of?
              </p>
              <Textarea
                value={formData.keyWin}
                onChange={(e) => handleTextChange("keyWin", e.target.value)}
                placeholder="e.g., I had a tough conversation and stayed calm..."
                className="min-h-24 text-sm resize-none"
                maxLength={200}
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.keyWin.length}/200
              </p>
            </div>

            {/* Biggest Challenge */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Biggest challenge
              </label>
              <p className="text-xs text-slate-500 mb-2">
                What was tricky? What's on your mind?
              </p>
              <Textarea
                value={formData.biggestChallenge}
                onChange={(e) => handleTextChange("biggestChallenge", e.target.value)}
                placeholder="e.g., I struggled to focus this afternoon..."
                className="min-h-24 text-sm resize-none"
                maxLength={200}
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.biggestChallenge.length}/200
              </p>
            </div>

            {/* Pen Moment */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                How I took back the pen
              </label>
              <p className="text-xs text-slate-500 mb-2">
                When did you take control today? What did you choose?
              </p>
              <Textarea
                value={formData.penMoment}
                onChange={(e) => handleTextChange("penMoment", e.target.value)}
                placeholder="e.g., I took back the pen when I decided to..."
                className="min-h-24 text-sm resize-none"
                maxLength={200}
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.penMoment.length}/200
              </p>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Back to today
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save check-in"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
