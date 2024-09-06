import React from "react";

const Background: React.FC = () => {
  return (
    <div className="overflow-x-hidden fixed inset-0 -z-50 h-full w-screen bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute top-0 left-0 w-screen h-full bg-white"></div>
      <div className="absolute top-0 left-0 w-screen h-full bg-[radial-gradient(circle_500px_at_10%_20%,#C9EBFF,transparent)] md:bg-[radial-gradient(circle_300px_at_10%_20%,#C9EBFF,transparent)] sm:bg-[radial-gradient(circle_200px_at_10%_20%,#C9EBFF,transparent)]"></div>
      <div className="absolute top-0 right-0 w-screen h-full bg-[radial-gradient(circle_500px_at_90%_20%,#C9EBFF,transparent)] md:bg-[radial-gradient(circle_300px_at_90%_20%,#C9EBFF,transparent)] sm:bg-[radial-gradient(circle_200px_at_90%_20%,#C9EBFF,transparent)]"></div>
    </div>
  );
};

export default Background;
