"use client";

import * as React from "react";
import {
  Search01Icon,
  Message01Icon,
  ThumbsUpIcon,
  UserIcon,
  FilterIcon,
  Sorting05Icon,
  CheckmarkCircle02Icon,
  MessageQuestionIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  SearchInput,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/core";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  replies: number;
  isAnswered: boolean;
  tags: string[];
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    author: "Alice Johnson",
    content:
      "Could you explain the difference between p-type and n-type semiconductors again? I'm a bit confused about the majority carriers.",
    timestamp: "2 hours ago",
    upvotes: 5,
    replies: 2,
    isAnswered: true,
    tags: ["Semiconductors", "Carriers"],
  },
  {
    id: "2",
    author: "Bob Smith",
    content:
      "When is the deadline for the first assignment? The syllabus says Friday but the portal says Thursday.",
    timestamp: "5 hours ago",
    upvotes: 2,
    replies: 1,
    isAnswered: false,
    tags: ["Assignment", "Logistics"],
  },
  {
    id: "3",
    author: "Charlie Davis",
    content:
      "Is there a recommended textbook for the advanced topics we discussed in Lecture 3?",
    timestamp: "Yesterday",
    upvotes: 8,
    replies: 4,
    isAnswered: true,
    tags: ["Resources", "Lecture 3"],
  },
];

export function CourseQA() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [questions, setQuestions] = React.useState<Question[]>(MOCK_QUESTIONS);
  const [isAsking, setIsAsking] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState("");

  const filteredQuestions = questions.filter(
    (q) =>
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleSubmit = () => {
    if (!newQuestion.trim()) return;
    const q: Question = {
      id: Date.now().toString(),
      author: "You",
      content: newQuestion,
      timestamp: "Just now",
      upvotes: 0,
      replies: 0,
      isAnswered: false,
      tags: ["General"],
    };
    setQuestions([q, ...questions]);
    setNewQuestion("");
    setIsAsking(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <SearchInput
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="h-11 rounded-xl gap-2 font-bold flex-1 md:flex-none"
          >
            <HugeiconsIcon icon={FilterIcon} size={18} />
            Filter
          </Button>
          <Button
            onClick={() => setIsAsking(true)}
            className="h-11 rounded-xl gap-2 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex-1 md:flex-none"
          >
            <HugeiconsIcon icon={MessageQuestionIcon} size={18} />
            Ask Question
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isAsking && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <textarea
                  placeholder="What is your question?"
                  className="w-full min-h-[120px] bg-background border border-muted/20 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAsking(false)}
                    className="font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground font-bold rounded-lg"
                  >
                    Post Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="group hover:shadow-md transition-all border-muted/10 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border border-muted/10">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                      {q.author
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "QA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {q.author}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          • {q.timestamp}
                        </span>
                      </div>
                      {q.isAnswered && (
                        <Badge className="bg-green-500/10 text-green-600 border-none flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={12}
                          />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {q.content}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-bold">
                        <HugeiconsIcon icon={ThumbsUpIcon} size={16} />
                        {q.upvotes}
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs font-bold">
                        <HugeiconsIcon icon={Message01Icon} size={16} />
                        {q.replies} Replies
                      </button>
                      <div className="flex gap-2">
                        {q.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
