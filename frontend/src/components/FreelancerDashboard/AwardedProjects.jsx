import React from 'react'
import { Link } from 'react-router-dom'

const AwardedProjects = ({ projects }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Awarded Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No awarded projects.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-green-50 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold">{proj.title}</h3>
              <p>Client: {proj.client.name}</p>
              <Link to={`/project/${proj._id}`} className="text-blue-600 hover:underline">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AwardedProjects
