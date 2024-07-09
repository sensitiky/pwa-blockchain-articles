import React from 'react';

type ProjectCardProps = {
  status: string;
  category: string;
  title: string;
  description: string;
  raised: number;
  target: number;
  milestones: number;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  status,
  category,
  title,
  description,
  raised,
  target,
  milestones,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-4">
      <div className="flex justify-between">
        <span className={`badge ${status.toLowerCase()}`}>{status}</span>
        <span className="category">{category}</span>
      </div>
      <h2 className="text-xl font-bold my-2">{title}</h2>
      <p className="text-gray-700">{description}</p>
      <div className="mt-4">
        <span className="block text-lg font-semibold">${raised.toLocaleString()}</span>
        <span className="block text-gray-500 text-sm">Total Money Raised</span>
      </div>
      <div className="mt-2">
        <span className="block text-lg font-semibold">${target.toLocaleString()}</span>
        <span className="block text-gray-500 text-sm">Target Raise</span>
      </div>
      <div className="mt-2">
        <span className="block text-lg font-semibold">{milestones} Milestones</span>
      </div>
      <div className="mt-4 flex space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Learn More</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded">View Roadmap</button>
      </div>
    </div>
  );
};

export default ProjectCard;
