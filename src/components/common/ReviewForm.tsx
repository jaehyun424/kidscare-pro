// ============================================
// Petit Stay - Review Form Component
// ============================================

import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import '../../styles/components/review-form.css';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (review: { rating: number; comment: string; tags: string[] }) => Promise<void>;
    bookingInfo?: { sitterName: string; date: string };
}

const REVIEW_TAGS = [
    'professional', 'punctual', 'creative', 'communicative',
    'attentive', 'fun', 'safe', 'experienced',
];

export function ReviewForm({ isOpen, onClose, onSubmit, bookingInfo }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        try {
            await onSubmit({ rating, comment, tags: selectedTags });
            setRating(0);
            setComment('');
            setSelectedTags([]);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review" size="md">
            <div className="review-form">
                {bookingInfo && (
                    <p className="review-form-intro">
                        Rate your experience with <strong>{bookingInfo.sitterName}</strong> on {bookingInfo.date}
                    </p>
                )}

                {/* Star Rating */}
                <div className="review-stars" role="group" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`review-star ${star <= (hoverRating || rating) ? 'review-star-active' : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                        >
                            ★
                        </button>
                    ))}
                    <span className="review-stars-label">
                        {rating > 0 ? `${rating}/5` : 'Select rating'}
                    </span>
                </div>

                {/* Tags */}
                <div className="review-tags">
                    {REVIEW_TAGS.map((tag) => (
                        <button
                            key={tag}
                            className={`review-tag ${selectedTags.includes(tag) ? 'review-tag-active' : ''}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Comment */}
                <textarea
                    className="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience (optional)"
                    rows={4}
                />

                <div className="review-form-actions">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="gold"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={rating === 0}
                    >
                        Submit Review
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// Star display component for showing existing reviews
interface StarRatingProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export function StarRating({ rating, size = 'md', showValue = false }: StarRatingProps) {
    return (
        <span className={`star-rating star-rating-${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={star <= rating ? 'star-filled' : 'star-empty'}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
            {showValue && (
                <span className="star-value">
                    {rating.toFixed(1)}
                </span>
            )}
        </span>
    );
}
