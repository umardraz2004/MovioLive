import ReactPlayer from "react-player";

const Theater = () => {
  const url = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
  return (
    <div className="flex mx-20 my-10">
      <div className="max-w-3xl aspect-video">
        <ReactPlayer src={url} width="100%" height="100%" controls />
      </div>
      <div className="ms-10 dark:bg-black bg-gray-200 p-4 rounded-lg flex-1">
        
      </div>
    </div>
  );
};

export default Theater;