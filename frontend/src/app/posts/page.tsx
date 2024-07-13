import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { JSX, SVGProps } from "react";
import Header2 from "@/assets/header2";
import Footer from "@/assets/footer";
import Image from 'next/image';

export default function Posts() {
  return (
    <div className="bg-gradient6 px-4 py-2 md:px-6 lg:py-2">
      <Header2 />
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            href="#"
            className="bg-inherit inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </Link>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">Acme Inc</p>
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <time dateTime="2023-07-13">July 13, 2023</time>
                <span>·</span>
                <span>5 min read</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <TwitterIcon className="h-5 w-5 text-black" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <LinkedinIcon className="h-5 w-5 text-black" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <GitlabIcon className="h-5 w-5 text-black" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border">
          <Image
            src="/test.jpg"
            alt="Banner"
            width={1200}
            height={300}
            className="aspect-[4/1] w-full object-cover"
          />
        </div>
        <div className="prose prose-gray mx-auto mt-8 dark:prose-invert">
          <p>
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne. One day, his advisors came to
            him with a problem: the kingdom was running out of money.
          </p>
          <Image
            src="/test.jpg"
            alt="Image"
            width={800}
            height={450}
            className="mx-auto aspect-video rounded-lg object-cover"
          />
          <p>
            Jokester began sneaking into the castle in the middle of the night
            and leaving jokes all over the place: under the king&apos;s pillow,
            in his soup, even in the royal toilet. The king was furious, but he
            couldn&apos;t seem to stop Jokester.
          </p>
          <p>
            And then, one day, the people of the kingdom discovered that the
            jokes left by Jokester were so funny that they couldn&apos;t help
            but laugh. And once they started laughing, they couldn&apos;t stop.
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <HeartIcon className="h-5 w-5" />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircleIcon className="h-5 w-5" />
              <span className="sr-only">Comment</span>
            </Button>
          </div>
          <div className="mb-32 mt-8 rounded-lg border p-4">
            <h3 className="text-lg font-medium">Comments</h3>
            <Accordion type="single" collapsible className="mt-4 space-y-2">
              <AccordionItem value="comment-1">
                <AccordionTrigger className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <time dateTime="2023-07-13">July 13, 2023</time>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-2 text-sm">
                    This post just made my day! 😃👍
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <HeartIcon className="h-4 w-4" />
                      <span className="sr-only">Reply</span>
                    </Button>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <time dateTime="2023-07-13">July 13, 2023</time>
                      <Button variant="ghost" size="icon">
                        <MessageCircleIcon className="h-4 w-4" />
                        <span className="sr-only">Like</span>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="comment-2">
                <AccordionTrigger className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Jane Doe</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <time dateTime="2023-07-13">July 13, 2023</time>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-2 text-sm">
                    Wow, this photo is absolutely stunning! 😍✨
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <HeartIcon className="h-4 w-4" />
                      <span className="sr-only">Reply</span>
                    </Button>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <time dateTime="2023-07-13">July 13, 2023</time>
                      <Button variant="ghost" size="icon">
                        <MessageCircleIcon className="h-4 w-4" />
                        <span className="sr-only">Like</span>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ArrowLeftIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function GitlabIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" />
    </svg>
  );
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function LinkedinIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MessageCircleIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
