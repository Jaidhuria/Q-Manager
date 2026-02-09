import React, { useState } from 'react';
import { GripVertical, Edit2, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import QuestionItem from './QuestionItem';
import QuestionForm from './QuestionForm';
import Modal from './Modal';

const SubtopicSection = ({
  subtopic,
  index,
  topicId,
  onUpdate,
  onDelete,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtopic.title);

  const handleUpdate = async () => {
    if (editTitle.trim()) {
      await onUpdate(topicId, subtopic.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this sub-topic? All questions will be deleted.')) {
      onDelete(topicId, subtopic.id);
    }
  };

  const handleAddQuestion = async (formData) => {
    await onAddQuestion(topicId, subtopic.id, formData);
    setIsAddingQuestion(false);
  };

  return (
    <Draggable draggableId={`subtopic-${subtopic.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div className="p-4 bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div
                  {...provided.dragHandleProps}
                  className="mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab"
                >
                  <GripVertical size={20} />
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleUpdate}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                    className="px-2 py-1 border border-primary-500 dark:border-primary-400 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                ) : (
                  <h3
                    className="font-semibold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setIsEditing(true)}
                  >
                    {subtopic.title}
                  </h3>
                )}
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                  ({subtopic.questions.length} questions)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingQuestion(true)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Add Question"
                >
                  <Plus size={18} />
                </button>
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

          {isExpanded && (
            <Droppable droppableId={`subtopic-${subtopic.id}`} type="QUESTION">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-[50px] ${
                    snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  {subtopic.questions.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                      No questions yet. Click + to add one.
                    </p>
                  ) : (
                    subtopic.questions.map((question, qIndex) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        index={qIndex}
                        topicId={topicId}
                        subtopicId={subtopic.id}
                        onUpdate={onUpdateQuestion}
                        onDelete={onDeleteQuestion}
                      />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}

          <Modal
            isOpen={isAddingQuestion}
            onClose={() => setIsAddingQuestion(false)}
            title="Add Question"
          >
            <QuestionForm
              onSubmit={handleAddQuestion}
              onCancel={() => setIsAddingQuestion(false)}
            />
          </Modal>
        </div>
      )}
    </Draggable>
  );
};

export default SubtopicSection;
