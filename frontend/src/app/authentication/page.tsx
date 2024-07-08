"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Header from "@/assets/header";

export default function Login() {
  return (
    <div className="flex flex-col min-h-dvh bg-customColor-innovatio">
      <Header />
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-b">
          <div className="flex justify-center container space-y-10 xl:space-y-16 px-4 md:px-6">
            <div className="grid gap-4 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  The complete platform for building the Web
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-xl flex justify-center content-center">
                  Beautifully designed components that you can copy and paste
                  into your apps. Accessible. Customizable. Open Source.
                </p>
                <div className="flex flex-col gap-4 mt-6 sm:flex-row">
                  <Link href="/test">
                  <Button className="rounded-full px-6 py-3 text-sm font-medium">
                    Sign Up
                  </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="bg-customColor-innovatio2 rounded-full px-6 py-3 text-sm font-medium hover:bg-white"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
