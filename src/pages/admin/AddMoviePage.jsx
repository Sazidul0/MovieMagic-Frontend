import React from 'react';
import { Link } from 'react-router-dom';

const AddMoviePage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Movie added successfully (frontend only)!');
    e.target.reset(); // Reset form after submission
  };

  return (
    <div className="mt-16 p-4 sm:p-8">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl sm:text-4xl font-bold">Add New Movie</h1>
         <Link to="/admin" className="btn btn-outline">Back to Dashboard</Link>
       </div>
      <div className="w-full max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Movie Title</span></label>
            <input type="text" placeholder="e.g., Inception" className="input input-bordered w-full" required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Description</span></label>
            <textarea placeholder="Movie summary..." className="textarea textarea-bordered h-24" required />
          </div>
           <div className="form-control">
            <label className="label"><span className="label-text">Poster URL</span></label>
            <input type="text" placeholder="https://..." className="input input-bordered w-full" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Genre</span></label>
              <input type="text" placeholder="e.g., Sci-Fi, Thriller" className="input input-bordered w-full" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Rating</span></label>
              <input type="number" step="0.1" min="0" max="10" placeholder="e.g., 8.8" className="input input-bordered w-full" required />
            </div>
          </div>
          <div className="form-control pt-6">
            <button className="btn btn-primary">Add Movie</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoviePage;