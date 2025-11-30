import React from "react";

const RoadmapViewer = ({ roadmap }) => {
  return (
    <div className="p-6 space-y-6">
      {Object.entries(roadmap).map(([skill, data]) => (
        <div key={skill} className="bg-white shadow-md p-6 rounded-lg">
          
          <h1 className="text-2xl font-bold">{data.main_course}</h1>
          <p className="text-gray-600">Duration: {data.duration_weeks} weeks</p>

          <h2 className="text-xl font-semibold mt-4">Subtopics</h2>
          <div className="space-y-3 mt-2">

            {data.subtopics.map((sub, index) => (
              <div
                key={index}
                className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded"
              >
                <h3 className="font-semibold text-lg">{sub.title}</h3>

                <p className="text-sm">
                  <b>Mini Project:</b> {sub.project}
                </p>

                <h4 className="font-medium mt-2">YouTube Tutorials</h4>
                <ul className="list-disc ml-5">
                  {sub.youtube_links.map((link, i) => (
                    <li key={i}>
                      <a
                        className="text-blue-600 underline"
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-6">Final Projects</h2>
          <ul className="list-disc ml-5">
            {data.final_projects.suggested.map((proj, i) => (
              <li key={i}>{proj}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">GitHub References</h2>
          <ul className="list-disc ml-5">
            {data.final_projects.github_references.map((repo, i) => (
              <li key={i}>
                <a
                  href={repo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {repo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RoadmapViewer;
