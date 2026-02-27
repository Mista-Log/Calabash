"use client";

import * as React from "react";
import {
  Message01Icon,
  ThumbsUpIcon,
  FilterIcon,
  CheckmarkCircle02Icon,
  MessageQuestionIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  Badge,
  SearchInput,
  Avatar,
  AvatarFallback,
  M3Button,
} from "@/components/core";
import { motion, AnimatePresence } from "@/lib/motion-foundations";

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
          <M3Button
            variant="outlined"
            className="h-11 rounded-xl gap-2 font-bold flex-1 md:flex-none"
          >
            <MaterialSymbol icon={FilterIcon} size={18} />
            Filter
          </M3Button>
          <M3Button
            onClick={() => setIsAsking(true)}
            className="h-11 rounded-xl gap-2 font-bold flex-1 md:flex-none"
          >
            <MaterialSymbol icon={MessageQuestionIcon} size={18} />
            Ask Question
          </M3Button>
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
                  className="w-full min-h-[120px] bg-background border border-muted/20 rounded-xl p-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <M3Button variant="text"
                    onClick={() => setIsAsking(false)}
                    className="font-bold"
                  >
                    Cancel
                  </M3Button>
                  <M3Button
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground font-bold rounded-lg"
                  >
                    Post Question
                  </M3Button>
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
            <Card className="group border-muted/10 transition-colors hover:border-primary/20 hover:bg-[color:var(--md-sys-color-surface-container-low)]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border border-muted/10">
                    <AvatarFallback className="bg-primary/5 text-primary text-[13px] font-bold">
                      {q.author
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "QA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-foreground">
                          {q.author}
                        </span>
                        <span className="text-[13px] font-medium text-muted-foreground">
                          • {q.timestamp}
                        </span>
                      </div>
                      {q.isAnswered && (
                        <Badge className="flex items-center gap-1 border-none bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)] text-[13px] font-black uppercase tracking-widest">
                          <MaterialSymbol
                            icon={CheckmarkCircle02Icon}
                            size={12}
                          />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {q.content}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-[13px] font-bold">
                        <MaterialSymbol icon={ThumbsUpIcon} size={16} />
                        {q.upvotes}
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-[13px] font-bold">
                        <MaterialSymbol icon={Message01Icon} size={16} />
                        {q.replies} Replies
                      </button>
                      <div className="flex gap-2">
                        {q.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[13px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter"
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


