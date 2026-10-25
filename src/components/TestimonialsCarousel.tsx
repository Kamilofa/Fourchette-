import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, PlusCircle, CheckCircle, ThumbsUp, Sparkles } from 'lucide-react';
import { TESTIMONIALS, Review } from '../data/restaurantData';

export const TestimonialsCarousel: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('Client vérifié');
  const [newRating, setNewRating] = useState(5);
  const [newHighlight, setNewHighlight] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newFavoriteDish, setNewFavoriteDish] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Autoplay effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const created: Review = {
      id: `custom-${Date.now()}`,
      author: newAuthor.trim(),
      role: newRole.trim() || 'Client vérifié',
      rating: newRating,
      date: "À l'instant",
      highlight: newHighlight.trim() || "Expérience culinaire remarquable !",
      comment: newComment.trim(),
      favoriteDish: newFavoriteDish.trim() || "Spécialités 5 Fourchettes"
    };

    setReviews([created, ...reviews]);
    setCurrentIndex(0);
    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setShowAddModal(false);
      setNewAuthor('');
      setNewComment('');
      setNewHighlight('');
      setNewFavoriteDish('');
    }, 1500);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section id="avis" className="py-20 bg-stone-50 border-b border-stone-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Google Proof badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
              Retours d'Expérience & Avis Vérifiés
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Ce que nos clients disent de nous
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              Plus de 860 gourmets ont partagé leur expérience au Restaurant 5 Fourchettes sur Google Maps. Découvrez leurs plats préférés et leur avis en toute transparence.
            </p>
          </div>

          {/* Rating Summary Card (adjacent proof) */}
          <div className="flex items-center gap-4 bg-white border border-stone-200 p-4 rounded-2xl shadow-sm">
            <div className="text-center pr-4 border-r border-stone-200">
              <span className="text-3xl font-bold font-mono text-stone-900">4.1</span>
              <div className="flex text-amber-500 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>868 avis Google Maps</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">Note moyenne certifiée à Douala</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Laisser un avis client</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlights banner from Google screenshots ("Bon à savoir") */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Saveurs Indiennes</h4>
              <p className="text-xs text-stone-600 mt-1">
                Les visiteurs recommandent particulièrement les excellents plats indiens aux saveurs riches et authentiques.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Portions Très Copieuses</h4>
              <p className="text-xs text-stone-600 mt-1">
                Les clients soulignent unanimement que les assiettes et pizzas XXL servies sont particulièrement copieuses.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Rapidité de Service</h4>
              <p className="text-xs text-stone-600 mt-1">
                Les avis mentionnent la grande rapidité et le professionnalisme du service en salle comme sur la terrasse.
              </p>
            </div>
          </div>
        </div>

        {/* The Interactive Carousel Box */}
        <div 
          className="relative bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <Quote className="w-12 h-12 text-amber-100 absolute top-6 right-6 pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Stars & Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {currentReview.date}
              </span>
            </div>

            {/* Review Highlight Quote */}
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
              « {currentReview.highlight} »
            </h3>

            {/* Review Full Text */}
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {currentReview.comment}
            </p>

            {/* Author info & favorite dish */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                  {currentReview.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{currentReview.author}</h4>
                  <p className="text-xs text-stone-500">{currentReview.role}</p>
                </div>
              </div>

              {currentReview.favoriteDish && (
                <div className="text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                  <span>Plat dégusté : </span>
                  <strong className="text-amber-800">{currentReview.favoriteDish}</strong>
                </div>
              )}
            </div>

          </div>

          {/* Carousel Controls (Previous / Next) */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-amber-600' : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-sm"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Add Review */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Partagez votre avis sur le Restaurant 5 Fourchettes
            </h3>
            <p className="text-xs text-stone-600">
              Votre avis sera visible instantanément par les autres convives de Douala.
            </p>

            {submittedFeedback ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-stone-900">Merci pour votre retour !</h4>
                <p className="text-xs text-stone-600">Votre avis a été ajouté au carousel avec succès.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Votre Nom ou Pseudo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Ex: Cédric Kamga"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Note *
                    </label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                    >
                      <option value={5}>5 étoiles ★★★★★ (Excellent)</option>
                      <option value={4}>4 étoiles ★★★★☆ (Très bien)</option>
                      <option value={3}>3 étoiles ★★★☆☆ (Bien)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Plat commandé
                    </label>
                    <input
                      type="text"
                      value={newFavoriteDish}
                      onChange={(e) => setNewFavoriteDish(e.target.value)}
                      placeholder="Ex: Pizza Tikka, Gambas..."
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Titre court / Point fort
                  </label>
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Ex: Repas copieux et accueil formidable !"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Votre commentaire détaillé *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Racontez votre expérience au 5 Fourchettes..."
                    className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Publier mon avis
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
