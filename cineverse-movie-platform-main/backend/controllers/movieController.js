const Movie = require('../models/Movie');

// @desc   Get all custom movies
// @route  GET /api/movies
exports.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, genre } = req.query;
    const query = {};
    if (category) query.category = category;
    if (genre) query.genre = { $in: [genre] };

    const movies = await Movie.find(query)
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Movie.countDocuments(query);

    res.json({
      success: true,
      movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single movie
// @route  GET /api/movies/:id
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'username');
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create movie (admin)
// @route  POST /api/movies
exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update movie (admin)
// @route  PUT /api/movies/:id
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete movie (admin)
// @route  DELETE /api/movies/:id
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
