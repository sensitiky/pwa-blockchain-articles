"use client";
import React, { useState } from "react";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Comment {
  id: number;
  name: string;
  message: string;
  time: string;
  response?: {
    name: string;
    message: string;
    time: string;
  };
  likes: number;
  userLiked: boolean;
  replies: Comment[];
  replyCount: number;
}

const initialComments: Comment[] = [
  {
    id: 1,
    name: "Mariana",
    message: 'Hi there! I am your first "superfan"...',
    time: "5 days ago",
    likes: 0,
    userLiked: false,
    replies: [],
    replyCount: 0,
  },
  {
    id: 2,
    name: "Lucas",
    message: "I already added the slipcase set as an add on...",
    time: "1 week ago",
    likes: 0,
    userLiked: false,
    replies: [],
    replyCount: 0,
  },
  {
    id: 3,
    name: "Esteban",
    message: "I might have missed it but could you say...",
    time: "1 month ago",
    likes: 0,
    userLiked: false,
    replies: [],
    replyCount: 0,
  },
];

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const [postLikes, setPostLikes] = useState(0);
  const [userLikedPost, setUserLikedPost] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj: Comment = {
      id: comments.length + 1,
      name: "You",
      message: newComment,
      time: "Just now",
      likes: 0,
      userLiked: false,
      replies: [],
      replyCount: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (parentId: number) => {
    if (reply[parentId]?.trim() === "") return;

    const newReplyObj: Comment = {
      id:
        comments.reduce((maxId, comment) => Math.max(maxId, comment.id), 0) + 1,
      name: "You",
      message: reply[parentId],
      time: "Just now",
      likes: 0,
      userLiked: false,
      replies: [],
      replyCount: 0,
    };

    setComments(
      comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [newReplyObj, ...comment.replies],
            replyCount: comment.replyCount + 1,
          };
        }
        return comment;
      })
    );

    setReply({ ...reply, [parentId]: "" });
  };

  const handleLike = (id: number, isReply = false, parentId?: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id && !isReply) {
          return {
            ...comment,
            likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
            userLiked: !comment.userLiked,
          };
        } else if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === id) {
                return {
                  ...reply,
                  likes: reply.userLiked ? reply.likes - 1 : reply.likes + 1,
                  userLiked: !reply.userLiked,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
  };

  const handlePostLike = () => {
    setPostLikes(userLikedPost ? postLikes - 1 : postLikes + 1);
    setUserLikedPost(!userLikedPost);
  };

  const totalComments = comments.reduce(
    (acc, comment) => acc + comment.replyCount + 1,
    0
  );

  const totalLikes =
    postLikes +
    comments.reduce(
      (acc, comment) =>
        acc +
        comment.likes +
        comment.replies.reduce((rAcc, reply) => rAcc + reply.likes, 0),
      0
    );

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 mx-auto max-w-4xl mt-6">
      {comments.map((comment) => (
        <div key={comment.id} className="mb-6">
          <div className="flex items-start">
            <img
              src="/shadcn.jpg"
              alt={comment.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 ml-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{comment.name}</p>
                <span className="text-gray-500 text-sm">{comment.time}</span>
              </div>
              <p className="mt-2 text-gray-700">{comment.message}</p>
              {comment.response && (
                <div className="mt-4 ml-8 p-4 border-l-4 border-gray-300 bg-gray-100 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <img
                        src="/shadcn.jpg"
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="ml-2 text-lg font-semibold">
                        {comment.response.name}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {comment.response.time}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    {comment.response.message}
                  </p>
                </div>
              )}
              <Accordion type="single" collapsible className="w-full mt-4">
                <AccordionItem value={`item-${comment.id}`}>
                  <AccordionTrigger>
                    Show {comment.replyCount} replies
                  </AccordionTrigger>
                  <AccordionContent>
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="mt-4 ml-8 p-4 border-l-4 border-gray-300 bg-gray-100 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <img
                              src="/shadcn.jpg"
                              alt={reply.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <p className="ml-2 text-lg font-semibold">
                              {reply.name}
                            </p>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {reply.time}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700">{reply.message}</p>
                        <div className="flex items-center justify-start mt-2 space-x-4">
                          <Button
                            className="flex items-center space-x-1 bg-inherit text-gray-500 hover:bg-transparent"
                            onClick={() =>
                              handleLike(reply.id, true, comment.id)
                            }
                          >
                            {reply.userLiked ? (
                              <FaHeart className="w-5 h-5 text-red-500" />
                            ) : (
                              <FaRegHeart className="w-5 h-5" />
                            )}
                            <span>{reply.likes}</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex items-center justify-between mt-2">
                <div className="flex space-x-4">
                  <Button
                    className="flex items-center space-x-1 bg-inherit text-gray-500 hover:bg-transparent"
                    onClick={() => handleLike(comment.id)}
                  >
                    {comment.userLiked ? (
                      <FaHeart className="w-5 h-5 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-5 h-5" />
                    )}
                    <span>{comment.likes}</span>
                  </Button>
                  <Button
                    className="flex items-center space-x-1 bg-inherit text-gray-500 hover:bg-transparent"
                    onClick={() =>
                      setReply({
                        ...reply,
                        [comment.id]: reply[comment.id] || "",
                      })
                    }
                  >
                    <FaRegComment className="w-5 h-5" />
                    <span>{comment.replyCount}</span>
                  </Button>
                </div>
                <div className="mt-2 w-full">
                  <Textarea
                    className="w-full p-4 border rounded-lg resize-none"
                    placeholder="Reply to comment..."
                    value={reply[comment.id] || ""}
                    onChange={(e) =>
                      setReply({ ...reply, [comment.id]: e.target.value })
                    }
                  ></Textarea>
                  <Button
                    onClick={() => handleAddReply(comment.id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <Textarea
          className="w-full p-4 border rounded-lg resize-none"
          placeholder="Leave a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></Textarea>
        <Button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Comment
        </Button>
      </div>

      <div className="flex items-center justify-start mt-4 space-x-4">
        <span className="text-gray-500">10 min read</span>
        <span className="bg-gray-500 w-px h-6"></span>
        <Button
          className="flex items-center space-x-1 bg-inherit text-gray-500 hover:bg-transparent"
          onClick={handlePostLike}
        >
          {userLikedPost ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5" />
          )}
          <span>{postLikes}</span>
        </Button>
        <Button className="flex items-center space-x-1 bg-inherit text-gray-500 hover:bg-transparent">
          <FaRegComment className="w-5 h-5" />
          <span>{totalComments}</span>
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
