import { useEffect } from "react";
import { useThreads } from "@/features/thread/hooks/useThreads";
import ThreadList from "@/features/thread/components/ThreadList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { threadEvents, THREAD_CREATED } from "@/components/Layout";

const TRENDING = [
  "#ReactJS",
  "#ViteJS",
  "#TypeScript",
  "#CleanCode",
  "#CircleApp",
];
const SUGGESTED = [
  { name: "Rizki Developer", username: "rizki_dev" },
  { name: "Sinta Coderina", username: "sinta_code" },
  { name: "Dev Indonesia", username: "dev_indonesia" },
];

export default function Home() {
  const { threads, isLoading, toggleLike, addThread } = useThreads();

  // Dengar event dari Layout saat thread baru dibuat
  useEffect(() => {
    const handler = (e: Event) => {
      const thread = (e as CustomEvent).detail;
      if (thread) addThread(thread);
    };
    threadEvents.addEventListener(THREAD_CREATED, handler);
    return () => threadEvents.removeEventListener(THREAD_CREATED, handler);
  }, [addThread]);

  return (
    <div className="flex">
      {/* Feed */}
      <div className="flex-1 border-r border-gray-900 min-h-screen">
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-900 px-5 py-4 z-10">
          <h2 className="font-bold text-sm tracking-tight">Home</h2>
        </div>

        <ThreadList
          threads={threads}
          isLoading={isLoading}
          onLike={toggleLike}
        />
      </div>

      {/* Right sidebar */}
      <div className="w-72 p-4 hidden lg:block space-y-4 flex-shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs">
              <TrendingUp size={13} className="text-aqua-400" />
              Trending
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-3 space-y-3">
            {TRENDING.map((tag, i) => (
              <div
                key={tag}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs text-gray-700">{i + 1} · Trending</p>
                  <p className="text-sm font-semibold text-white group-hover:text-aqua-400 transition-colors">
                    {tag}
                  </p>
                </div>
                <Badge variant="aqua" className="text-xs">
                  {Math.floor(Math.random() * 9) + 1}K
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Suggested for you</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-3 space-y-3">
            {SUGGESTED.map((u) => (
              <div
                key={u.username}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs">
                      {u.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-gray-600">@{u.username}</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-aqua-400 border border-aqua-800 hover:border-aqua-400 px-2.5 py-1 rounded-full transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
