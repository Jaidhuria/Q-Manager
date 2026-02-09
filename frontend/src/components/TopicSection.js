import React, { useState } from 'react';
import { GripVertical, Edit2, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SubtopicSection from './SubtopicSection';
import Modal from './Modal';

const TopicSection = ({
  topic,
  index,
  onUpdate,
  onDelete,
  onAddSubtopic,
  onUpdateSubtopic,
  onDeleteSubtopic,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  filters,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingSubtopic, setIsAddingSubtopic] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');

  const handleUpdate = async () => {
    if (editTitle.trim()) {
      await onUpdate(topic.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this topic? All sub-topics and questions will be deleted.')) {
      onDelete(topic.id);
    }
  };

  const handleAddSubtopic = async () => {
    if (newSubtopicTitle.trim()) {
      await onAddSubtopic(topic.id, newSubtopicTitle.trim());
      setNewSubtopicTitle('');
      setIsAddingSubtopic(false);
    }
  };

  return (
    <Draggable draggableId={`topic-${topic.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 transition-colors ${
            snapshot.isDragging ? 'shadow-xl' : 'shadow-md'
          }`}
        >
          <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-t-lg border-b-2 border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div
                  {...provided.dragHandleProps}
                  className="mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-grab"
                >
                  <GripVertical size={24} />
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                </button>
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleUpdate}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                    className="px-3 py-2 border-2 border-primary-500 dark:border-primary-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                ) : (
                  <h2
                    className="text-xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-primary-700 dark:hover:text-primary-400"
                    onClick={() => setIsEditing(true)}
                  >
                    {topic.title}
                  </h2>
                )}
                <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                  {topic.subTopics.length} sub-topic{topic.subTopics.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingSubtopic(true)}
                  className="px-3 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Sub-topic
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {isExpanded && (
            <Droppable droppableId={`topic-${topic.id}`} type="SUBTOPIC">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-[100px] ${
                    snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {topic.subTopics.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                      No sub-topics yet. Click "Add Sub-topic" to create one.
                    </p>
                  ) : (
                    topic.subTopics.map((subtopic, stIndex) => (
                      <SubtopicSection
                        key={subtopic.id}
                        subtopic={subtopic}
                        index={stIndex}
                        topicId={topic.id}
                        onUpdate={onUpdateSubtopic}
                        onDelete={onDeleteSubtopic}
                        onAddQuestion={onAddQuestion}
                        onUpdateQuestion={onUpdateQuestion}
                        onDeleteQuestion={onDeleteQuestion}
                        filters={filters}
                      />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}

          <Modal
            isOpen={isAddingSubtopic}
            onClose={() => {
              setIsAddingSubtopic(false);
              setNewSubtopicTitle('');
            }}
            title="Add Sub-topic"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sub-topic Title *
                </label>
                <input
                  type="text"
                  value={newSubtopicTitle}
                  onChange={(e) => setNewSubtopicTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtopic()}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Easy, Medium, Hard"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSubtopic(false);
                    setNewSubtopicTitle('');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubtopic}
                  className="px-4 py-2 text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                >
                  Add Sub-topic
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </Draggable>
  );
};

export default TopicSection;
