import * as React from "react";
import { DocumentCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Material } from "@/services/api";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@/components/core";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion-variants";
import { useSettingsStore } from "@/store/useSettingsStore";

interface MaterialCardProps {
  material: Material;
  onView?: (material: Material) => void;
}

export function MaterialCard({ material, onView }: MaterialCardProps) {
  const { reducedMotion } = useSettingsStore();

  return (
    <motion.div
      variants={fadeIn}
      whileHover={reducedMotion ? {} : { y: -2 }}
      className="h-full"
    >
      <Card className="h-full transition-shadow hover:shadow-xl border-border/40 overflow-hidden bg-white/50 backdrop-blur-sm group flex flex-col">
        <div className="relative h-24 bg-accent/5 flex items-center justify-center border-b border-border/10 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.div
            initial={false}
            whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <HugeiconsIcon
              icon={DocumentCodeIcon}
              size={40}
              className="text-primary/20 transition-colors group-hover:text-primary/40"
            />
          </motion.div>
          <div className="absolute h-1 bottom-0 left-0 right-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </div>

        <CardHeader className="pb-2 space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="font-mono text-[10px] tracking-wider uppercase bg-primary/5 text-primary border-none"
            >
              {material.courseCode}
            </Badge>
            <span className="text-[10px] font-medium text-muted-foreground/60">
              {material.uploadDate}
            </span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
              {material.title}
            </CardTitle>
            <CardDescription className="text-xs flex items-center gap-1.5 font-medium">
              <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[10px] text-accent">
                {material.uploader.charAt(0)}
              </span>
              {material.uploader}
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="mt-auto pt-4 flex items-center justify-end border-t border-border/5 bg-accent/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(material)}
            className="h-8 text-xs font-bold hover:bg-primary hover:text-primary-foreground rounded-full px-4"
          >
            Open Resource
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
