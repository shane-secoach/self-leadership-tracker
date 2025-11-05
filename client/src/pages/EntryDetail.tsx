import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";

interface EntryDetailProps {
  params: {
    date: string;
  };
}

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

export default function EntryDetail({ params }: EntryDetailProps) {
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data: entry, isLoading } = trpc.checkIn.getByDate.useQuery({
    date: params.date,
  });

  const saveMutation = trpc.checkIn.save.useMutation();
  const deleteMutation = trpc.checkIn.delete.useMutation();

  useEffect(() => {
    if (entry && !formData) {
      setFormData(entry);
    }
  }, [entry, formData]);

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData);
      alert("Check-in updated. Nice one.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Oops, something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure? This can't be undone.")) {
      try {
        await deleteMutation.mutateAsync({ date: params.date });
        alert("Entry deleted.");
        navigate("/history");
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Oops, something went wrong.");
      }
    }
  };

  const handleSliderChange = (key: string, value: number[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleTextChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!entry || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => navigate("/history")}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="p-8 text-center border-0 shadow-sm">
            <p className="text-slate-600">Entry not found.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button
            onClick={() => (isEditing ? setIsEditing(false) : navigate("/history"))}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Back"}
          </Button>
          <h1 className="text-2xl font-bold text-indigo-900">
            {new Date(params.date + 'T00:00:00').toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h1>
          <div className="w-12" />
        </div>

        {!isEditing ? (
          <>
            {/* View Mode */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-medium mb-1">Mood</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {entry.moodScore}
                  </p>
                  <p className="text-xs text-indigo-500 mt-1">/10</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <p className="text-xs text-teal-600 font-medium mb-1">Energy</p>
                  <p className="text-3xl font-bold text-teal-900">
                    {entry.energyScore}
                  </p>
                  <p className="text-xs text-teal-500 mt-1">/10</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <p className="text-xs text-red-600 font-medium mb-1">Stress</p>
                  <p className="text-3xl font-bold text-red-900">
                    {entry.stressScore}
                  </p>
                  <p className="text-xs text-red-500 mt-1">/10</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4">
                Your Four Pillars
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {pillarQuestions.map((pillar) => {
                  const value = entry[pillar.key as keyof typeof entry];
                  const numValue = typeof value === 'number' ? value : 0;
                  return (
                    <div
                      key={pillar.key}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                    >
                      <p className="text-xs text-slate-600 font-medium mb-2">
                        {pillar.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {numValue}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">/5</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {(entry.keyWin || entry.biggestChallenge || entry.penMoment) && (
              <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
                <h2 className="text-lg font-semibold text-indigo-900 mb-4">
                  Your Story
                </h2>
                <div className="space-y-4">
                  {entry.keyWin && (
                    <div className="border-l-4 border-lime-500 pl-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        Today's win
                      </p>
                      <p className="text-sm text-slate-700">{entry.keyWin}</p>
                    </div>
                  )}
                  {entry.biggestChallenge && (
                    <div className="border-l-4 border-orange-500 pl-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        Biggest challenge
                      </p>
                      <p className="text-sm text-slate-700">
                        {entry.biggestChallenge}
                      </p>
                    </div>
                  )}
                  {entry.penMoment && (
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        How I took back the pen
                      </p>
                      <p className="text-sm text-slate-700">{entry.penMoment}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <form className="space-y-8">
              <Card className="p-6 border-0 shadow-sm bg-white">
                <h2 className="text-lg font-semibold text-indigo-900 mb-6">
                  Edit Your Check-in
                </h2>

                {/* Mood */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Mood: {formData.moodScore}
                    </label>
                    <span className="text-xs text-slate-500">1–10</span>
                  </div>
                  <Slider
                    value={[formData.moodScore]}
                    onValueChange={(value) => handleSliderChange("moodScore", value)}
                    min={1}
                    max={10}
                    step={1}
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
                  <Slider
                    value={[formData.energyScore]}
                    onValueChange={(value) => handleSliderChange("energyScore", value)}
                    min={1}
                    max={10}
                    step={1}
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
                  <Slider
                    value={[formData.stressScore]}
                    onValueChange={(value) => handleSliderChange("stressScore", value)}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm bg-white">
                <h2 className="text-lg font-semibold text-indigo-900 mb-6">
                  Your Four Pillars
                </h2>

                <div className="space-y-8">
                  {pillarQuestions.map((pillar) => {
                    const value = formData[pillar.key as keyof typeof formData];
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
                          className="mb-2"
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

              <Card className="p-6 border-0 shadow-sm bg-white">
                <h2 className="text-lg font-semibold text-indigo-900 mb-6">
                  Your Story
                </h2>

                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Today's win
                  </label>
                  <Textarea
                    value={formData.keyWin || ""}
                    onChange={(e) => handleTextChange("keyWin", e.target.value)}
                    className="min-h-24 text-sm resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {(formData.keyWin || "").length}/200
                  </p>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Biggest challenge
                  </label>
                  <Textarea
                    value={formData.biggestChallenge || ""}
                    onChange={(e) => handleTextChange("biggestChallenge", e.target.value)}
                    className="min-h-24 text-sm resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {(formData.biggestChallenge || "").length}/200
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    How I took back the pen
                  </label>
                  <Textarea
                    value={formData.penMoment || ""}
                    onChange={(e) => handleTextChange("penMoment", e.target.value)}
                    className="min-h-24 text-sm resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {(formData.penMoment || "").length}/200
                  </p>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
