<<<<<<< HEAD
﻿"use client";

import { StarIcon } from "@/lib/icons/material-icons";
import * as React from "react";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";

import Image from "next/image";
=======
"use client";

import { StarIcon, LibraryIcon } from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import Image from "next/image"; // Import Image component
>>>>>>> origin/main

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
<<<<<<< HEAD
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-[color:var(--md-sys-color-surface)]">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col px-0 md:px-6 md:py-12 lg:w-1/2 lg:px-12 xl:px-16">
        {/* Logo - Mobile Only */}
        <div className="lg:hidden mb-8 flex justify-center pt-6">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-2xl"
              style={{ backgroundColor: "var(--md-sys-color-primary)" }}
            >
              <MaterialSymbol
                icon="school"
                size={24}
                style={{ color: "var(--md-sys-color-on-primary)" }}
              />
            </div>
            <span className="m3-title-large text-[color:var(--md-sys-color-on-surface)] font-semibold">
              Calabash
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-1 items-center justify-center py-8 md:py-0">
          <div className="w-full max-w-[440px] px-4 md:px-0">{children}</div>
=======
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
>>>>>>> origin/main
        </div>
      </div>

      {/* Right Side: Visuals */}
<<<<<<< HEAD
      <div className="relative hidden lg:block lg:w-1/2 overflow-hidden">
        {/* Background */}
=======
      <div className="relative hidden lg:block lg:w-1/2">
        {/* Background Image */}
>>>>>>> origin/main
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
<<<<<<< HEAD
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="50vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-16">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <MaterialSymbol
                  icon="school"
                  size={28}
                  className="text-white"
                />
              </div>
              <span className="text-[28px] font-bold text-white">
                Calabash
              </span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="text-white">
            {/* Stars */}
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <MaterialSymbol
                  key={i}
                  icon={StarIcon}
                  className="text-[22px] text-[color:var(--md-sys-color-tertiary-container)]"
                  fill
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="mb-8">
              <p className="text-[26px] font-medium leading-snug">
                "{testimonial.quote}"
              </p>
            </blockquote>
            
            {/* Author */}
            <footer className="flex items-center gap-4">
              {testimonial.avatar ? (
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-white/30 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 border-2 border-white/30 font-bold uppercase text-xl">
                  {testimonial.author.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-[18px] font-bold">
                  {testimonial.author}
                </div>
                <div className="text-[15px] text-white/70">
                  {testimonial.role}
                </div>
              </div>
            </footer>
          </div>
=======
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
>>>>>>> origin/main
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
