import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Plus, Loader2, Sun, Moon } from 'lucide-react';
import TopicSection from './TopicSection';
import Modal from './Modal';
import ChartsSection from './ChartsSection';
import useSheetStore from '../store/useSheetStore';
import useThemeStore from '../store/useThemeStore';

const QuestionSheet = () => {
  const {
    sheet,
    loading,
    error,
    addTopic,
    updateTopic,
    deleteTopic,
    addSubtopic,
    updateSubtopic,
    deleteSubtopic,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderTopics,
  } = useSheetStore();

  const { isDark, toggleTheme } = useThemeStore();
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleAddTopic = async () => {
    if (newTopicTitle.trim()) {
      await addTopic(newTopicTitle.trim());
      setNewTopicTitle('');
      setIsAddingTopic(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, type, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle topic reordering
    if (type === 'TOPIC') {
      const newTopics = Array.from(sheet.topics);
      const [removed] = newTopics.splice(source.index, 1);
      newTopics.splice(destination.index, 0, removed);
      await reorderTopics(newTopics);
      return;
    }

    // Handle sub-topic reordering within a topic
    if (type === 'SUBTOPIC' && draggableId.startsWith('subtopic-')) {
      const topicId = source.droppableId.replace('topic-', '');
      const topic = sheet.topics.find((t) => t.id === topicId);
      if (topic) {
        const newSubTopics = Array.from(topic.subTopics);
        const [removed] = newSubTopics.splice(source.index, 1);
        newSubTopics.splice(destination.index, 0, removed);
        const updatedTopics = sheet.topics.map((t) =>
          t.id === topicId ? { ...t, subTopics: newSubTopics } : t
        );
        await reorderTopics(updatedTopics);
      }
      return;
    }

    // Handle question reordering within a sub-topic
    if (type === 'QUESTION' && draggableId.startsWith('question-')) {
      const subtopicId = source.droppableId.replace('subtopic-', '');
      const topic = sheet.topics.find((t) =>
        t.subTopics.some((st) => st.id === subtopicId)
      );
      if (topic) {
        const subtopic = topic.subTopics.find((st) => st.id === subtopicId);
        if (subtopic) {
          const newQuestions = Array.from(subtopic.questions);
          const [removed] = newQuestions.splice(source.index, 1);
          newQuestions.splice(destination.index, 0, removed);
          const updatedTopics = sheet.topics.map((t) =>
            t.id === topic.id
              ? {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subtopicId ? { ...st, questions: newQuestions } : st
                  ),
                }
              : t
          );
          await reorderTopics(updatedTopics);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="animate-spin text-primary-600 dark:text-primary-400" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!sheet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{sheet.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your questions organized by topics and sub-topics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={22} /> : <Moon size={22} />}
              </button>
              <button
                onClick={() => setIsAddingTopic(true)}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Add Topic
              </button>
            </div>
          </div>
        </div>

        <ChartsSection sheet={sheet} />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="topics" type="TOPIC">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-4 ${
                  snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4' : ''
                }`}
              >
                {sheet.topics.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-400 dark:text-gray-500 text-lg">
                      No topics yet. Click "Add Topic" to get started.
                    </p>
                  </div>
                ) : (
                  sheet.topics.map((topic, index) => (
                    <TopicSection
                      key={topic.id}
                      topic={topic}
                      index={index}
                      onUpdate={updateTopic}
                      onDelete={deleteTopic}
                      onAddSubtopic={addSubtopic}
                      onUpdateSubtopic={updateSubtopic}
                      onDeleteSubtopic={deleteSubtopic}
                      onAddQuestion={addQuestion}
                      onUpdateQuestion={updateQuestion}
                      onDeleteQuestion={deleteQuestion}
                    />
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Modal
        isOpen={isAddingTopic}
        onClose={() => {
          setIsAddingTopic(false);
          setNewTopicTitle('');
        }}
        title="Add Topic"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Topic Title *
            </label>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="e.g., Arrays, Linked List, Trees"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddingTopic(false);
                setNewTopicTitle('');
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTopic}
              className="px-4 py-2 text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Add Topic
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionSheet;
