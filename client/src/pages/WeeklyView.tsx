import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

export default function WeeklyView() {
  const [, navigate] = useLocation();
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate week dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const start = new Date(currentWeekStart);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    return { start: startStr, end: endStr, startDate: start, endDate: end };
  }, [weekOffset]);

  const { data: weekData, isLoading } = trpc.checkIn.weekSummary.useQuery({
    startDate: weekDates.start,
    endDate: weekDates.end,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "bg-lime-500";
    if (percentage >= 60) return "bg-teal-500";
    if (percentage >= 40) return "bg-indigo-500";
    return "bg-orange-500";
  };

  const getScoreWidth = (score: number, max: number) => {
    return `${(score / max) * 100}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const hasEntries = weekData?.entries && weekData.entries.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 pt-4">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Your Week
          </h1>
          <p className="text-slate-600">
            {weekDates.startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            –{" "}
            {weekDates.endDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="flex-1"
          >
            This week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 0}
            className="flex-1"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {hasEntries ? (
          <>
            {/* Weekly Averages */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-indigo-900 mb-6">
                Weekly Averages
              </h2>

              <div className="space-y-6">
                {/* Mood */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Mood
                    </label>
                    <span className="text-sm font-bold text-indigo-600">
                      {weekData?.averages?.mood?.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(
                        weekData?.averages?.mood || 0,
                        10
                      )} transition-all`}
                      style={{
                        width: getScoreWidth(weekData?.averages?.mood || 0, 10),
                      }}
                    />
                  </div>
                </div>

                {/* Energy */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Energy
                    </label>
                    <span className="text-sm font-bold text-teal-600">
                      {weekData?.averages?.energy?.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(
                        weekData?.averages?.energy || 0,
                        10
                      )} transition-all`}
                      style={{
                        width: getScoreWidth(weekData?.averages?.energy || 0, 10),
                      }}
                    />
                  </div>
                </div>

                {/* Stress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Stress
                    </label>
                    <span className="text-sm font-bold text-red-600">
                      {weekData?.averages?.stress?.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-red-500 transition-all`}
                      style={{
                        width: getScoreWidth(weekData?.averages?.stress || 0, 10),
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Pillars */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-indigo-900 mb-6">
                Your Four Pillars
              </h2>

              <div className="space-y-6">
                {/* Self-awareness */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Self-awareness
                    </label>
                    <span className="text-sm font-bold text-indigo-600">
                      {weekData?.averages?.selfAwareness?.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all"
                      style={{
                        width: getScoreWidth(
                          weekData?.averages?.selfAwareness || 0,
                          5
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Mindset */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Mindset
                    </label>
                    <span className="text-sm font-bold text-teal-600">
                      {weekData?.averages?.mindset?.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all"
                      style={{
                        width: getScoreWidth(weekData?.averages?.mindset || 0, 5),
                      }}
                    />
                  </div>
                </div>

                {/* Action */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Action
                    </label>
                    <span className="text-sm font-bold text-lime-600">
                      {weekData?.averages?.action?.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-lime-500 transition-all"
                      style={{
                        width: getScoreWidth(weekData?.averages?.action || 0, 5),
                      }}
                    />
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Impact
                    </label>
                    <span className="text-sm font-bold text-purple-600">
                      {weekData?.averages?.impact?.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{
                        width: getScoreWidth(weekData?.averages?.impact || 0, 5),
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Insights */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4">
                Your Insights
              </h2>

              <div className="space-y-4">
                {weekData?.strongestPillar && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Your strongest pillar this week
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-semibold text-lime-700">
                          {weekData.strongestPillar.name}
                        </span>{" "}
                        is shining. Keep leaning into this.
                      </p>
                    </div>
                  </div>
                )}

                {weekData?.weakestPillar && (
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        The pillar that could use a bit of love
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-semibold text-orange-700">
                          {weekData.weakestPillar.name}
                        </span>{" "}
                        is calling for attention. What's one small thing you could do?
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Daily Entries */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4">
                This Week's Entries
              </h2>

              <div className="space-y-3">
                {weekData?.entries?.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => navigate(`/entry/${entry.date}`)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-slate-900">
                        {formatDate(entry.date)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString(
                          "en-US",
                          { weekday: "short" }
                        )}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-indigo-600 font-medium">
                        Mood: {entry.moodScore}
                      </span>
                      <span className="text-teal-600 font-medium">
                        Energy: {entry.energyScore}
                      </span>
                      <span className="text-slate-500">
                        Stress: {entry.stressScore}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-8 border-0 shadow-sm bg-slate-50 text-center">
            <p className="text-slate-600 mb-4">
              No check-ins this week yet. Start logging to see your patterns.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Back to today
            </Button>
          </Card>
        )}

        {/* Footer Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full mt-6"
        >
          Back to today
        </Button>
      </div>
    </div>
  );
}
