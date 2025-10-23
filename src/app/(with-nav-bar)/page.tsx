"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@stackframe/stack";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import {
  Zap,
  Users,
  TrendingUp,
  MessageSquare,
  Search,
  Lock,
  BarChart3,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  }
);

const GLOBE_COLORS = ["#06b6d4", "#3b82f6", "#6366f1"];

export default function HomePage() {
  const user = useUser();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const globeConfig = isDark
    ? {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
      }
    : {
        pointSize: 4,
        globeColor: "#4582FF",
        showAtmosphere: true,
        atmosphereColor: "#1764FF",
        atmosphereAltitude: 0.2,
        emissive: "#ffffff",
        emissiveIntensity: 0.05,
        shininess: 1,
        polygonColor: "rgb(0,0,0)",
        ambientLight: "#93c5fd",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#f1f5f9",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
      };
  const sampleArcs = useMemo(
    () => [
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.1,
        color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
      },
      {
        order: 1,
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -1.303396,
        endLng: 36.852443,
        arcAlt: 0.5,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 2,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 2,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 2,
        startLat: -15.785493,
        startLng: -47.909029,
        endLat: 36.162809,
        endLng: -115.119411,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 3,
        startLat: -33.8688,
        startLng: 151.2093,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 3,
        startLat: 21.3099,
        startLng: -157.8581,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 3,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 4,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.5,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 4,
        startLat: -34.6037,
        startLng: -58.3816,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.7,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 4,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.1,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 5,
        startLat: 14.5995,
        startLng: 120.9842,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 5,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 5,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 6,
        startLat: -15.432563,
        startLng: 28.315853,
        endLat: 1.094136,
        endLng: -63.34546,
        arcAlt: 0.7,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 6,
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.1,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 6,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 7,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.1,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 7,
        startLat: 48.8566,
        startLng: -2.3522,
        endLat: 52.52,
        endLng: 13.405,
        arcAlt: 0.1,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 7,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 8,
        startLat: -8.833221,
        startLng: 13.264837,
        endLat: -33.936138,
        endLng: 18.436529,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 8,
        startLat: 49.2827,
        startLng: -123.1207,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 8,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.5,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 9,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 9,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.7,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 9,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.5,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 10,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: 28.6139,
        endLng: 77.209,
        arcAlt: 0.7,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 10,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 10,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 52.3676,
        endLng: 4.9041,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 11,
        startLat: 41.9028,
        startLng: 12.4964,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 11,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 31.2304,
        endLng: 121.4737,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 11,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 1.3521,
        endLng: 103.8198,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 12,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 37.7749,
        endLng: -122.4194,
        arcAlt: 0.1,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 12,
        startLat: 35.6762,
        startLng: 139.6503,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.2,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 12,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 13,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 13,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 13,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: -34.6037,
        endLng: -58.3816,
        arcAlt: 0.1,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
      {
        order: 14,
        startLat: -33.936138,
        startLng: 18.436529,
        endLat: 21.395643,
        endLng: 39.883798,
        arcAlt: 0.3,
        color:
          GLOBE_COLORS[Math.floor(Math.random() * (GLOBE_COLORS.length - 1))],
      },
    ],
    []
  );

  return (
    <>
      {/* Hero Section */}
      <div className="sm:h-[calc(100dvh-4.1rem)] flex flex-col">
        <main className="flex-1 flex flex-col-reverse sm:flex-row sm:justify-between sm:h-[calc(100vh-4rem-1px)] sm:overflow-hidden">
          <div className="flex flex-col justify-center my-10 sm:my-0 max-w-2xl space-y-6 flex-1 px-4 sm:pl-16 lg:pl-24 sm:pr-6 lg:pr-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Matching{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Founders
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Investors
              </span>{" "}
              Effortlessly
            </h1>
            <p className="text-lg text-muted-foreground">
              Accelerate fundraising with smart matchmaking that connects the
              right startups with the right investors.
            </p>
            {!user && (
              <div className="w-full">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto justify-center"
                >
                  <Link
                    href="/sign-up"
                    className="font-semibold w-full sm:w-auto text-center"
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <div className="sm:relative sm:overflow-hidden sm:w-[47rem]">
            <div className="sm:absolute inset-0 h-[21rem] sm:h-full w-full">
              <div className="relative w-full h-full" key={resolvedTheme}>
                <World data={sampleArcs} globeConfig={globeConfig} />
              </div>
            </div>
          </div>
        </main>

        {/* Scroll Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
          <a
            href="#features"
            className="bg-primary/90 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <span className="text-sm font-semibold text-primary-foreground">
              Learn about our features
            </span>
            <svg
              className="w-5 h-5 text-primary-foreground animate-bounce-down"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 md:py-16 bg-muted/30 scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to connect with the right partners and
              accelerate your growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Scoring-Based Matching",
                description:
                  "Intelligent matching algorithm that scores compatibility between startups and investors based on detailed profile data and investment criteria.",
              },
              {
                icon: Search,
                title: "Advanced Search",
                description:
                  "Explore profiles with powerful filters to find investors or startups that match your specific funding stage, industry, and preferences.",
              },
              {
                icon: MessageSquare,
                title: "Secure P2P Chat",
                description:
                  "Real-time encrypted messaging to discuss opportunities, clarify terms, and build relationships directly with potential partners.",
              },
              {
                icon: TrendingUp,
                title: "Video Pitches",
                description:
                  "Showcase your startup with compelling video pitches that help investors quickly understand your business model and traction.",
              },
              {
                icon: BarChart3,
                title: "Comprehensive Analytics",
                description:
                  "Track engagement metrics, investor interactions, and platform insights to refine your strategy and increase visibility.",
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description:
                  "End-to-end encryption, secure data storage, verification process, and compliance with data privacy regulations.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 md:py-16 scroll-mt-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and begin connecting with potential
              partners
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description:
                  "Create your account and choose your role as a founder or investor.",
              },
              {
                step: "2",
                title: "Complete Profile",
                description:
                  "Fill in your details, preferences, and investment criteria or startup information.",
              },
              {
                step: "3",
                title: "Get Verified",
                description:
                  "Our team reviews your profile to ensure authenticity and credibility.",
              },
              {
                step: "4",
                title: "Start Connecting",
                description:
                  "Receive matches, search for partners, and begin meaningful conversations.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 bg-muted/30 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About FundSeekr
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              FundSeekr was built by a passionate student developer with a
              vision to democratize fundraising and make it easier for founders
              and investors to connect globally. We believe that great ideas
              deserve great funding, and the right connections can change
              everything.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-primary/20 mb-6">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-3 text-lg">Student-Built</h3>
              <p className="text-sm text-muted-foreground">
                Created by a dedicated student developer learning and building
                in public.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-primary/20 mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-3 text-lg">Community Focused</h3>
              <p className="text-sm text-muted-foreground">
                Built with founders and investors in mind, for the entire
                startup ecosystem.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-primary/20 mb-6">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-3 text-lg">
                Continuously Improving
              </h3>
              <p className="text-sm text-muted-foreground">
                We&apos;re constantly adding features and improving based on
                user feedback.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of founders and investors already using FundSeekr to
            accelerate their growth.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/sign-up">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 FundSeekr. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
