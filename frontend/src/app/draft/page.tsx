import React from 'react';
import Header2 from '@/assets/header2';
import Footer2 from '@/assets/footer2';
import CommentSection from '@/assets/comments';
import Image from 'next/image';

const BlogPost = () => {

  return (
    <div className="bg-white shadow-md rounded-lg mx-auto">
      <Header2/>
      <div className='mx-auto max-w-4xl py-28 px-8'>
      <a href="/articles" className="text-base text-gray-700">&larr; Go back</a>
      <div className="mt-4">
        <h1 className="text-2xl font-bold">Dear junior developer, I don't care about your portfolio</h1>
        <p className="text-gray-500 mt-1">July 24, 2022 • 10 min read</p>
      </div>
      <div className="flex items-center mt-4">
        <Image src="/shadcn.jpg" alt="Author" width={50} height={50}className="rounded-full"/>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">Juan Pablo Martínez</p>
          <p className="text-sm text-gray-500">Developer Content Creator</p>
        </div>
      </div>
      <div className="mt-6">
        <img src="/test.jpg" alt="Blog post image" className="w-full h-64 object-cover rounded-lg"/>
        <div className="mt-4 space-y-4 text-gray-700">
          <p>Seu ad perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...</p>
          <p>...ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo...</p>
          <img src="/test.jpg" alt="Blog post image" className="w-80 h-20 object-cover rounded-lg"/>
          <p>Seu ad perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...</p>
          <p>...ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo...</p>
        </div>
      </div>
      </div>
      <CommentSection/>
      <Footer2/>
    </div>
  );
};

export default BlogPost;