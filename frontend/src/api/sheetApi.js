import apiClient from './client';

export const getSheet = async (slug = 'striver-sde-sheet') => {
  const response = await apiClient.get(`/api/question-tracker/v1/sheet/public/get-sheet-by-slug/${slug}`);
  return response.data;
};

export const updateSheet = async (sheetData) => {
  const response = await apiClient.put('/api/sheet', sheetData);
  return response.data;
};

export const addTopic = async (title) => {
  const response = await apiClient.post('/api/topics', { title });
  return response.data;
};

export const updateTopic = async (topicId, title) => {
  const response = await apiClient.put(`/api/topics/${topicId}`, { title });
  return response.data;
};

export const deleteTopic = async (topicId) => {
  const response = await apiClient.delete(`/api/topics/${topicId}`);
  return response.data;
};

export const addSubtopic = async (topicId, title) => {
  const response = await apiClient.post(`/api/topics/${topicId}/subtopics`, { title });
  return response.data;
};

export const updateSubtopic = async (topicId, subtopicId, title) => {
  const response = await apiClient.put(`/api/topics/${topicId}/subtopics/${subtopicId}`, { title });
  return response.data;
};

export const deleteSubtopic = async (topicId, subtopicId) => {
  const response = await apiClient.delete(`/api/topics/${topicId}/subtopics/${subtopicId}`);
  return response.data;
};

export const addQuestion = async (topicId, subtopicId, questionData) => {
  const response = await apiClient.post(`/api/topics/${topicId}/subtopics/${subtopicId}/questions`, questionData);
  return response.data;
};

export const updateQuestion = async (topicId, subtopicId, questionId, questionData) => {
  const response = await apiClient.put(`/api/topics/${topicId}/subtopics/${subtopicId}/questions/${questionId}`, questionData);
  return response.data;
};

export const deleteQuestion = async (topicId, subtopicId, questionId) => {
  const response = await apiClient.delete(`/api/topics/${topicId}/subtopics/${subtopicId}/questions/${questionId}`);
  return response.data;
};

export const reorderSheet = async (topics) => {
  const response = await apiClient.put('/api/sheet/reorder', { topics });
  return response.data;
};
