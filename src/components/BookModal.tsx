import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { X, BookPlus, Edit3, AlertCircle } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: Book | null;
}

const CATEGORIES = [
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Science',
  'Literature',
  'History',
  'Business',
  'Psychology',
  'Philosophy',
  'Medicine',
  'Other'
];

export const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, bookToEdit }) => {
  const { addBook, updateBook } = useLibrary();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 3,
    copiesAvailable: 3,
    description: '',
    shelfLocation: 'Aisle 1, Shelf A',
    publishedYear: new Date().getFullYear(),
    publisher: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        isbn: bookToEdit.isbn,
        category: bookToEdit.category,
        totalCopies: bookToEdit.totalCopies,
        copiesAvailable: bookToEdit.copiesAvailable,
        description: bookToEdit.description,
        shelfLocation: bookToEdit.shelfLocation,
        publishedYear: bookToEdit.publishedYear,
        publisher: bookToEdit.publisher,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'Computer Science',
        totalCopies: 3,
        copiesAvailable: 3,
        description: '',
        shelfLocation: 'Aisle 1, Shelf A',
        publishedYear: new Date().getFullYear(),
        publisher: '',
      });
    }
    setErrors({});
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Book title is required';
    if (!formData.author.trim()) errs.author = 'Author name is required';
    if (!formData.isbn.trim()) errs.isbn = 'ISBN is required';
    if (formData.totalCopies < 1) errs.totalCopies = 'Total copies must be at least 1';
    if (formData.copiesAvailable < 0) errs.copiesAvailable = 'Available copies cannot be negative';
    if (formData.copiesAvailable > formData.totalCopies) {
      errs.copiesAvailable = 'Available copies cannot exceed total copies';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (bookToEdit) {
      updateBook(bookToEdit.bookId, formData);
    } else {
      addBook(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              {bookToEdit ? <Edit3 className="w-5 h-5" /> : <BookPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {bookToEdit ? 'Update Book Details' : 'Add New Book to Inventory'}
              </h3>
              <p className="text-xs text-slate-500">
                {bookToEdit ? `Modifying Catalog ID: ${bookToEdit.bookId}` : 'Register a new catalog record for circulation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Author(s) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Erich Gamma, Richard Helm"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.author ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.author && <p className="text-xs text-rose-500 mt-1">{errors.author}</p>}
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ISBN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="e.g. 978-0201633610"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.isbn ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.isbn && <p className="text-xs text-rose-500 mt-1">{errors.isbn}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category / Department
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Shelf Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shelf Location / Call Number
              </label>
              <input
                type="text"
                value={formData.shelfLocation}
                onChange={e => setFormData({ ...formData, shelfLocation: e.target.value })}
                placeholder="e.g. Aisle 3, Shelf B"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* Total Copies */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Copies in Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    totalCopies: val,
                    // If adding new book, keep available copies in sync with total
                    copiesAvailable: bookToEdit ? prev.copiesAvailable : val,
                  }));
                }}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.totalCopies ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.totalCopies && <p className="text-xs text-rose-500 mt-1">{errors.totalCopies}</p>}
            </div>

            {/* Available Copies */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Copies (Not currently issued) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max={formData.totalCopies}
                value={formData.copiesAvailable}
                onChange={e => setFormData({ ...formData, copiesAvailable: parseInt(e.target.value) || 0 })}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.copiesAvailable ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.copiesAvailable && <p className="text-xs text-rose-500 mt-1">{errors.copiesAvailable}</p>}
            </div>

            {/* Publisher & Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="e.g. Addison-Wesley Professional"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Year</label>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={e => setFormData({ ...formData, publishedYear: parseInt(e.target.value) || 2024 })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Book Summary / Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a brief synopsis of the book content and syllabus relevance..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-book-btn"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {bookToEdit ? 'Save Changes' : 'Register Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
