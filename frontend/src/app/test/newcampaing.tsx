import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CreateCampaignScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 bg-black text-white p-10 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-10">Let's start with the inicial description</h1>
        <div className="flex flex-col space-y-4">
          <Button className="text-white bg-gray-700 rounded-full px-4 py-2">Step 1</Button>
          <Button className="text-white bg-gray-700 rounded-full px-4 py-2">Step 2</Button>
          <Button className="text-white bg-gray-700 rounded-full px-4 py-2">Step 3</Button>
          <Button className="text-white bg-gray-700 rounded-full px-4 py-2">Step 4</Button>
        </div>
      </div>
      <div className="w-2/3 bg-gray-100 p-10">
        <div className="flex justify-end">
            <Link href="/">
          <Button className="bg-gray-200 rounded-full px-4 py-2">Exit</Button></Link>
        </div>
        <form className="space-y-4 mt-10">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Title of project"
              className="border border-gray-300 rounded-md p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Category"
              className="border border-gray-300 rounded-md p-2 w-1/2"
            />
          </div>
          <textarea
            placeholder="Talk a bit about description. Minimum 200 characters."
            className="border border-gray-300 rounded-md p-2 w-full h-48"
          />
          <Button className="bg-black text-white rounded-full px-4 py-2">Continue</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignScreen;
