import React from "react";

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute top-0 left-0 w-full h-full bg-white"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_10%_20%,#C9EBFF,transparent)]"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_500px_at_90%_20%,#C9EBFF,transparent)]"></div>
    </div>
  );
};

export default Background;
