import React from 'react';

const AddMovie = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Movie added successfully (frontend only)!');
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-2xl font-bold my-4">Add New Movie</h2>
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-control">
          <label className="label"><span className="label-text">Title</span></label>
          <input type="text" placeholder="Movie Title" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Description</span></label>
          <textarea placeholder="Description" className="textarea textarea-bordered" required />
        </div>
         <div className="form-control">
          <label className="label"><span className="label-text">Poster URL</span></label>
          <input type="text" placeholder="Image URL" className="input input-bordered" required />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Add Movie</button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;