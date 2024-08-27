import React from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

interface PostDescriptionProps {
  description: string | null;
}

const PostDescription = ({ description }: PostDescriptionProps) => {
  if (!description) {
    return <div className="text-lg justify-between"></div>;
  }

  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <div className="text-lg justify-between break-words overflow-hidden">
      {parse(sanitizedDescription)}
    </div>
  );
};

export default PostDescription;
