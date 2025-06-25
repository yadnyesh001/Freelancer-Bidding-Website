import Review from '../models/review.model.js';

export const createReview = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { rating, comment } = req.body;

    if (!jobId || !rating) {
      return res.status(400).json({ message: 'Job ID and rating are required' });
    }

    const review = await Review.create({
      project: jobId,
      reviewer: req.user._id,
      reviewee: req.body.reviewee, 
      rating,
      comment,
    });

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error("Error in createReview:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name email')
      .populate('project', 'title');

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getReviewsForUser:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}