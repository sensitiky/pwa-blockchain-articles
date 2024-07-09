// components/Draft.tsx
import React from "react";
import Image from "next/image";

const Draft: React.FC = () => {
  // Aquí es donde implementarás la lógica para obtener los posts desde la base de datos
  // const posts = fetchPostsFromDatabase();

  // Ejemplo de datos estáticos
  const posts = [
    {
      id: 1,
      title: "Cardano Women in Tech Summit",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      amount: "$280,000",
      milestone: "1st Milestone",
      tags: ["Active", "Event"],
      bgColor: "bg-white",
    },
    {
      id: 2,
      title: "Cardano Academy: Empowering Individuals",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      amount: "$30,000",
      milestone: "25% Target Raised",
      tags: ["Unrealized", "Education"],
      bgColor: "bg-red-100",
    },
    {
      id: 3,
      title: "CNFT Studio – Empower Artists",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      amount: "$30,000",
      milestone: "Target Reached",
      tags: ["Fundraising", "Technology"],
      bgColor: "bg-green-100",
    },
    {
      id: 4,
      title: "Green Gaming Guild: Play & Earn",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      amount: "$50,000",
      milestone: "3 Milestones",
      tags: ["Closed", "Gaming"],
      bgColor: "bg-blue-100",
    },
    {
      id: 5,
      title: "Cardano-verse – The VR Metaverse",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      amount: "$120,000",
      milestone: "3rd Milestone",
      tags: ["Relief", "Technology"],
      bgColor: "bg-red-100",
    },
    {
      id: 6,
      title: "Weekly Cardano Podcast.",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      amount: "$98,000",
      milestone: "3rd Milestone",
      tags: ["Business", "Social"],
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`relative p-6 rounded-lg shadow-md ${post.bgColor} border border-gray-200`}
          >
            <div className="flex items-center mb-4">
              <Image
                src="/path/to/image.jpg"
                alt="Campaign"
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold">{post.amount}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">{post.milestone}</span>
              <div className="flex space-x-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300">
                View Roadmap
              </button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-gray-200 text-black px-6 py-2 rounded-full hover:bg-gray-300">
          Explore more campaigns
        </button>
      </div>
    </div>
  );
};

export default Draft;
