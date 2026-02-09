import React, { useState } from 'react';
import { GripVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import QuestionForm from './QuestionForm';
import Modal from './Modal';

const QuestionItem = ({ question, index, topicId, subtopicId, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300';
      case 'Hard':
        return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Solved':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300';
      case 'In Progress':
        return 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300';
      case 'Not Started':
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getNextStatus = (status) => {
    const order = ['Not Started', 'In Progress', 'Solved'];
    const currentIndex = order.indexOf(status || 'Not Started');
    const nextIndex = (currentIndex + 1) % order.length;
    return order[nextIndex];
  };

  const handleUpdate = async (formData) => {
    await onUpdate(topicId, subtopicId, question.id, formData);
    setIsEditing(false);
  };

  const handleStatusToggle = async () => {
    const nextStatus = getNextStatus(question.status);
    await onUpdate(topicId, subtopicId, question.id, {
      ...question,
      status: nextStatus,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(topicId, subtopicId, question.id);
    }
  };

  return (
    <>
      <Draggable draggableId={`question-${question.id}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-2 transition-shadow ${
              snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div
                  {...provided.dragHandleProps}
                  className="mr-3 mt-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab"
                >
                  <GripVertical size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{question.title}</h4>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      type="button"
                      onClick={handleStatusToggle}
                      className="focus:outline-none group"
                      title="Click to cycle status"
                    >
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded border border-transparent group-hover:border-primary-400 transition-colors ${getStatusStyles(
                          question.status || 'Not Started'
                        )}`}
                      >
                        {question.status || 'Not Started'}
                      </span>
                    </button>
                  </div>
                  {question.link && (
                    <a
                      href={question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      View Problem
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Question"
      >
        <QuestionForm
          question={question}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
};

export default QuestionItem;
