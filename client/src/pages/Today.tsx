import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Today() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const { data: todayCheckIn, isLoading: isFetching } = trpc.checkIn.today.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = getLoginUrl();
      } else {
        setIsLoading(false);
      }
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const pillarNames: Record<string, string> = {
    pillarSelfAwareness: "Self-awareness",
    pillarMindset: "Mindset",
    pillarAction: "Action",
    pillarImpact: "Impact",
  };

  const getStrongestPillar = () => {
    if (!todayCheckIn) return null;
    const pillars = [
      { name: "Self-awareness", value: todayCheckIn.pillarSelfAwareness },
      { name: "Mindset", value: todayCheckIn.pillarMindset },
      { name: "Action", value: todayCheckIn.pillarAction },
      { name: "Impact", value: todayCheckIn.pillarImpact },
    ];
    return pillars.reduce((a, b) => (a.value > b.value ? a : b));
  };

  const strongestPillar = getStrongestPillar();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-6">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            How are you leading yourself today?
          </h1>
          <p className="text-slate-600">
            {todayCheckIn
              ? "You've got this. Here's your snapshot."
              : "No check-in yet. Start with one honest minute."}
          </p>
        </div>

        {todayCheckIn ? (
          <>
            {/* Today's Summary Card */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-indigo-900">
                  Today's Snapshot
                </h2>
                <span className="text-sm text-slate-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Quick Scores */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Mood</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {todayCheckIn.moodScore}
                  </p>
                  <p className="text-xs text-slate-400">/10</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Energy</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {todayCheckIn.energyScore}
                  </p>
                  <p className="text-xs text-slate-400">/10</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Stress</p>
                  <p className="text-2xl font-bold text-red-600">
                    {todayCheckIn.stressScore}
                  </p>
                  <p className="text-xs text-slate-400">/10</p>
                </div>
              </div>

              {/* Strongest Pillar */}
              {strongestPillar && (
                <div className="bg-mint-50 border border-mint-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <p className="text-sm font-semibold text-teal-900">
                      Your strongest pillar today
                    </p>
                  </div>
                  <p className="text-lg font-bold text-teal-700">
                    {strongestPillar.name}
                  </p>
                  <p className="text-xs text-teal-600 mt-1">
                    Score: {strongestPillar.value}/5
                  </p>
                </div>
              )}
            </Card>

            {/* Pillars Grid */}
            <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                Your Four Pillars
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-medium mb-1">
                    Self-awareness
                  </p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {todayCheckIn.pillarSelfAwareness}
                  </p>
                  <p className="text-xs text-indigo-500 mt-1">/5</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <p className="text-xs text-teal-600 font-medium mb-1">Mindset</p>
                  <p className="text-3xl font-bold text-teal-900">
                    {todayCheckIn.pillarMindset}
                  </p>
                  <p className="text-xs text-teal-500 mt-1">/5</p>
                </div>
                <div className="bg-lime-50 rounded-lg p-4 border border-lime-100">
                  <p className="text-xs text-lime-600 font-medium mb-1">Action</p>
                  <p className="text-3xl font-bold text-lime-900">
                    {todayCheckIn.pillarAction}
                  </p>
                  <p className="text-xs text-lime-500 mt-1">/5</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-xs text-purple-600 font-medium mb-1">Impact</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {todayCheckIn.pillarImpact}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">/5</p>
                </div>
              </div>
            </Card>

            {/* Today's Notes */}
            {(todayCheckIn.keyWin || todayCheckIn.biggestChallenge || todayCheckIn.penMoment) && (
              <Card className="p-6 mb-6 border-0 shadow-sm bg-white">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                  Your Story Today
                </h3>
                <div className="space-y-4">
                  {todayCheckIn.keyWin && (
                    <div className="border-l-4 border-lime-500 pl-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        Today's win
                      </p>
                      <p className="text-sm text-slate-700">{todayCheckIn.keyWin}</p>
                    </div>
                  )}
                  {todayCheckIn.biggestChallenge && (
                    <div className="border-l-4 border-orange-500 pl-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        Biggest challenge
                      </p>
                      <p className="text-sm text-slate-700">
                        {todayCheckIn.biggestChallenge}
                      </p>
                    </div>
                  )}
                  {todayCheckIn.penMoment && (
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        How I took back the pen
                      </p>
                      <p className="text-sm text-slate-700">{todayCheckIn.penMoment}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/week")}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                View my week
              </Button>
              <Button
                onClick={() => navigate("/check-in")}
                variant="outline"
                className="w-full"
              >
                Update today's check-in
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* No Check-in Yet */}
            <Card className="p-8 mb-6 border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white text-center">
              <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-indigo-900 mb-2">
                You haven't logged today yet
              </h2>
              <p className="text-slate-600 mb-6">
                Take just one honest minute to check in with yourself. It's a tiny step
                that leads to big shifts.
              </p>
              <Button
                onClick={() => navigate("/check-in")}
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Log today
              </Button>
            </Card>

            {/* Quick Tips */}
            <Card className="p-6 border-0 shadow-sm bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                What to expect
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold mt-0.5">•</span>
                  <span>Rate your mood, energy, and stress (1–10)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold mt-0.5">•</span>
                  <span>Score your four pillars of self-leadership (1–5)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-600 font-bold mt-0.5">•</span>
                  <span>Share your win, challenge, and a moment you took back the pen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Takes about 1–2 minutes. That's it.</span>
                </li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
