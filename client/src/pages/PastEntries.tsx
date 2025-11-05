import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function PastEntries() {
  const [, navigate] = useLocation();
  const [monthOffset, setMonthOffset] = useState(0);

  // Calculate month
  const monthDates = useMemo(() => {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth() + 1;
    return { year, month };
  }, [monthOffset]);

  const { data: entries, isLoading } = trpc.checkIn.monthEntries.useQuery({
    year: monthDates.year,
    month: monthDates.month,
  });

  const monthName = new Date(monthDates.year, monthDates.month - 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  // Group entries by week
  const entriesByWeek = useMemo(() => {
    if (!entries) return [];

    const weeks: { [key: number]: typeof entries } = {};
    entries.forEach((entry) => {
      const date = new Date(entry.date + 'T00:00:00');
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.getTime();

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(entry);
    });

    return Object.entries(weeks)
      .map(([key, weekEntries]) => ({
        weekStart: new Date(parseInt(key)),
        entries: weekEntries.sort((a, b) => a.date.localeCompare(b.date)),
      }))
      .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
  }, [entries]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatWeekRange = (weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${formatDate(weekStart.toISOString().split('T')[0])} – ${formatDate(
      weekEnd.toISOString().split('T')[0]
    )}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 pt-4">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Your History
          </h1>
          <p className="text-slate-600">
            Look back and notice the patterns.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthOffset(monthOffset - 1)}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthOffset(0)}
            disabled={monthOffset === 0}
            className="flex-1"
          >
            This month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthOffset(monthOffset + 1)}
            disabled={monthOffset >= 0}
            className="flex-1"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Month Display */}
        <div className="flex items-center gap-2 mb-6 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">{monthName}</span>
        </div>

        {entriesByWeek.length > 0 ? (
          <div className="space-y-6">
            {entriesByWeek.map((week) => (
              <Card key={week.weekStart.getTime()} className="p-6 border-0 shadow-sm bg-white">
                <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">
                  {formatWeekRange(week.weekStart)}
                </h2>

                <div className="space-y-3">
                  {week.entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => navigate(`/entry/${entry.date}`)}
                      className="w-full text-left p-4 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {new Date(entry.date + 'T00:00:00').toLocaleDateString(
                              "en-US",
                              { weekday: "long", month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Mood</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {entry.moodScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Energy</p>
                          <p className="text-lg font-bold text-teal-600">
                            {entry.energyScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Stress</p>
                          <p className="text-lg font-bold text-red-600">
                            {entry.stressScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Avg Pillar</p>
                          <p className="text-lg font-bold text-purple-600">
                            {(
                              (entry.pillarSelfAwareness +
                                entry.pillarMindset +
                                entry.pillarAction +
                                entry.pillarImpact) /
                              4
                            ).toFixed(1)}
                          </p>
                        </div>
                      </div>

                      {/* Pillars */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-indigo-600 font-medium">
                            SA
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {entry.pillarSelfAwareness}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-teal-600 font-medium">MS</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {entry.pillarMindset}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-lime-600 font-medium">AC</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {entry.pillarAction}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-purple-600 font-medium">
                            IM
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {entry.pillarImpact}
                          </p>
                        </div>
                      </div>

                      {/* Summary */}
                      {(entry.keyWin || entry.biggestChallenge || entry.penMoment) && (
                        <div className="text-xs text-slate-500 pt-3 border-t border-slate-200">
                          {entry.keyWin && (
                            <p className="mb-1">
                              <span className="font-medium text-lime-700">Win:</span>{" "}
                              {entry.keyWin.substring(0, 40)}
                              {entry.keyWin.length > 40 ? "..." : ""}
                            </p>
                          )}
                          {entry.biggestChallenge && (
                            <p className="mb-1">
                              <span className="font-medium text-orange-700">Challenge:</span>{" "}
                              {entry.biggestChallenge.substring(0, 40)}
                              {entry.biggestChallenge.length > 40 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 border-0 shadow-sm bg-slate-50 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">
              No entries in {monthName} yet. Start logging to build your history.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Start logging
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
