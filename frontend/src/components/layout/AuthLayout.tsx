"use client";

import { StarIcon, LibraryIcon } from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import Image from "next/image"; // Import Image component

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: string;
  video?: string;
  testimonial: Testimonial;
}

export function AuthLayout({
  children,
  image,
  video,
  testimonial,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-background">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col px-4 py-8 md:px-6 md:py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mb-12 flex justify-center lg:justify-start">
          <div className="flex items-center gap-2 font-bold text-primary text-2xl">
            <HugeiconsIcon icon={LibraryIcon} size={32} />
            Calabash
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>

      {/* Right Side: Visuals */}
      <div className="relative hidden lg:block lg:w-1/2">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : image ? (
            <Image
              src={image}
              alt="Auth context"
              fill // Use fill to cover the parent div
              style={{ objectFit: 'cover' }}
              priority // Assuming this is an LCP image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Testimonial Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-12 text-white">
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <HugeiconsIcon
                key={i}
                icon={StarIcon}
                className="fill-yellow-400 text-yellow-400"
                size={16}
              />
            ))}
          </div>

          <blockquote className="space-y-6">
            <p className="text-2xl font-medium leading-tight md:text-3xl">
              “{testimonial.quote}”
            </p>
            <footer className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48} // Explicit width
                    height={48} // Explicit height
                    className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border-2 border-white/20 font-bold uppercase">
                    {testimonial.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-lg font-bold">{testimonial.author}</div>
                  <div className="text-sm text-white/60">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}