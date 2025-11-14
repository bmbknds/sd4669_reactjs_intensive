import apiClient from './api-client';
import { Review, ApiResponse } from '../types';

export const reviewService = {
  /**
   * Get reviews by user ID
   */
  getReviewsByUserId: async (userId: string): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
    return response.data.data;
  },

  /**
   * Submit review (Officer only)
   */
  submitReview: async (
    data: Omit<Review, 'id' | 'reviewedAt'>
  ): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
    return response.data.data;
  },

  /**
   * Get all reviews (Officer only)
   */
  getAllReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>('/reviews');
    return response.data.data;
  },

  /**
   * Update review
   */
  updateReview: async (reviewId: string, data: Partial<Review>): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${reviewId}`, data);
    return response.data.data;
  },
};
