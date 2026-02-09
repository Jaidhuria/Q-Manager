import React, { useState, useEffect } from 'react';

const QuestionForm = ({ question, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    difficulty: 'Medium',
  });

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title || '',
        link: question.link || '',
        difficulty: question.difficulty || 'Medium',
      });
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Question Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Link
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className={inputClass}
          placeholder="https://leetcode.com/problems/..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Difficulty
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          className={inputClass}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          {question ? 'Update' : 'Add'} Question
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
