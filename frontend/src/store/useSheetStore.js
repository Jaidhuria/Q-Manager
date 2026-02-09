import { create } from 'zustand';
import * as sheetApi from '../api/sheetApi';

const useSheetStore = create((set, get) => ({
  sheet: null,
  loading: false,
  error: null,

  // Fetch sheet data
  fetchSheet: async (slug = 'striver-sde-sheet') => {
    set({ loading: true, error: null });
    try {
      const response = await sheetApi.getSheet(slug);
      set({ sheet: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching sheet:', error);
    }
  },

  // Add topic
  addTopic: async (title) => {
    try {
      const response = await sheetApi.addTopic(title);
      const newTopic = response.data;
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: [...state.sheet.topics, newTopic],
        },
      }));
      return newTopic;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update topic
  updateTopic: async (topicId, title) => {
    try {
      const response = await sheetApi.updateTopic(topicId, title);
      const updatedTopic = response.data;
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId ? updatedTopic : topic
          ),
        },
      }));
      return updatedTopic;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete topic
  deleteTopic: async (topicId) => {
    try {
      await sheetApi.deleteTopic(topicId);
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.filter((topic) => topic.id !== topicId),
        },
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Add sub-topic
  addSubtopic: async (topicId, title) => {
    try {
      const response = await sheetApi.addSubtopic(topicId, title);
      const newSubtopic = response.data;
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId
              ? { ...topic, subTopics: [...topic.subTopics, newSubtopic] }
              : topic
          ),
        },
      }));
      return newSubtopic;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update sub-topic
  updateSubtopic: async (topicId, subtopicId, title) => {
    try {
      const response = await sheetApi.updateSubtopic(topicId, subtopicId, title);
      const updatedSubtopic = response.data;
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((st) =>
                    st.id === subtopicId ? updatedSubtopic : st
                  ),
                }
              : topic
          ),
        },
      }));
      return updatedSubtopic;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete sub-topic
  deleteSubtopic: async (topicId, subtopicId) => {
    try {
      await sheetApi.deleteSubtopic(topicId, subtopicId);
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.filter((st) => st.id !== subtopicId),
                }
              : topic
          ),
        },
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Add question
  addQuestion: async (topicId, subtopicId, questionData) => {
    try {
      const response = await sheetApi.addQuestion(topicId, subtopicId, questionData);
      const newQuestion = response.data;
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((st) =>
                    st.id === subtopicId
                      ? { ...st, questions: [...st.questions, newQuestion] }
                      : st
                  ),
                }
              : topic
          ),
        },
      }));
      return newQuestion;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update question
  updateQuestion: async (topicId, subtopicId, questionId, questionData) => {
    try {
      const response = await sheetApi.updateQuestion(topicId, subtopicId, questionId, questionData);
      const updatedQuestion = response.data;
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((st) =>
                    st.id === subtopicId
                      ? {
                          ...st,
                          questions: st.questions.map((q) =>
                            q.id === questionId ? updatedQuestion : q
                          ),
                        }
                      : st
                  ),
                }
              : topic
          ),
        },
      }));
      return updatedQuestion;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete question
  deleteQuestion: async (topicId, subtopicId, questionId) => {
    try {
      await sheetApi.deleteQuestion(topicId, subtopicId, questionId);
      set((state) => ({
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subTopics: topic.subTopics.map((st) =>
                    st.id === subtopicId
                      ? {
                          ...st,
                          questions: st.questions.filter((q) => q.id !== questionId),
                        }
                      : st
                  ),
                }
              : topic
          ),
        },
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Reorder topics
  reorderTopics: async (newTopics) => {
    try {
      const response = await sheetApi.reorderSheet(newTopics);
      set({ sheet: response.data.data });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));

export default useSheetStore;
