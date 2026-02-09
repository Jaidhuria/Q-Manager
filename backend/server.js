const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
let questionSheet = {
  id: '1',
  title: 'Striver SDE Sheet',
  slug: 'striver-sde-sheet',
  topics: [
    {
      id: 'topic-1',
      title: 'Arrays',
      order: 0,
      subTopics: [
        {
          id: 'subtopic-1',
          title: 'Easy',
          order: 0,
          questions: [
            {
              id: 'q-1',
              title: 'Set Matrix Zeroes',
              link: 'https://leetcode.com/problems/set-matrix-zeroes/',
              difficulty: 'Medium',
              order: 0
            },
            {
              id: 'q-2',
              title: 'Pascal\'s Triangle',
              link: 'https://leetcode.com/problems/pascals-triangle/',
              difficulty: 'Easy',
              order: 1
            }
          ]
        },
        {
          id: 'subtopic-2',
          title: 'Medium',
          order: 1,
          questions: [
            {
              id: 'q-3',
              title: 'Rotate Image',
              link: 'https://leetcode.com/problems/rotate-image/',
              difficulty: 'Medium',
              order: 0
            }
          ]
        }
      ]
    },
    {
      id: 'topic-2',
      title: 'Linked List',
      order: 1,
      subTopics: [
        {
          id: 'subtopic-3',
          title: 'Easy',
          order: 0,
          questions: [
            {
              id: 'q-4',
              title: 'Reverse Linked List',
              link: 'https://leetcode.com/problems/reverse-linked-list/',
              difficulty: 'Easy',
              order: 0
            }
          ]
        }
      ]
    }
  ]
};

// Helper function to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// GET - Get entire sheet
app.get('/api/question-tracker/v1/sheet/public/get-sheet-by-slug/:slug', (req, res) => {
  res.json({
    success: true,
    data: questionSheet
  });
});

// GET - Get entire sheet (alternative endpoint)
app.get('/api/sheet', (req, res) => {
  res.json({
    success: true,
    data: questionSheet
  });
});

// PUT - Update entire sheet
app.put('/api/sheet', (req, res) => {
  questionSheet = req.body;
  res.json({
    success: true,
    data: questionSheet,
    message: 'Sheet updated successfully'
  });
});

// POST - Add topic
app.post('/api/topics', (req, res) => {
  const { title } = req.body;
  const newTopic = {
    id: generateId('topic'),
    title,
    order: questionSheet.topics.length,
    subTopics: []
  };
  questionSheet.topics.push(newTopic);
  res.json({
    success: true,
    data: newTopic
  });
});

// PUT - Update topic
app.put('/api/topics/:topicId', (req, res) => {
  const { topicId } = req.params;
  const { title } = req.body;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    topic.title = title;
    res.json({ success: true, data: topic });
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// DELETE - Delete topic
app.delete('/api/topics/:topicId', (req, res) => {
  const { topicId } = req.params;
  const index = questionSheet.topics.findIndex(t => t.id === topicId);
  if (index !== -1) {
    questionSheet.topics.splice(index, 1);
    // Reorder remaining topics
    questionSheet.topics.forEach((topic, idx) => {
      topic.order = idx;
    });
    res.json({ success: true, message: 'Topic deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// POST - Add sub-topic
app.post('/api/topics/:topicId/subtopics', (req, res) => {
  const { topicId } = req.params;
  const { title } = req.body;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    const newSubTopic = {
      id: generateId('subtopic'),
      title,
      order: topic.subTopics.length,
      questions: []
    };
    topic.subTopics.push(newSubTopic);
    res.json({ success: true, data: newSubTopic });
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// PUT - Update sub-topic
app.put('/api/topics/:topicId/subtopics/:subtopicId', (req, res) => {
  const { topicId, subtopicId } = req.params;
  const { title } = req.body;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    const subTopic = topic.subTopics.find(st => st.id === subtopicId);
    if (subTopic) {
      subTopic.title = title;
      res.json({ success: true, data: subTopic });
    } else {
      res.status(404).json({ success: false, message: 'Sub-topic not found' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// DELETE - Delete sub-topic
app.delete('/api/topics/:topicId/subtopics/:subtopicId', (req, res) => {
  const { topicId, subtopicId } = req.params;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    const index = topic.subTopics.findIndex(st => st.id === subtopicId);
    if (index !== -1) {
      topic.subTopics.splice(index, 1);
      // Reorder remaining sub-topics
      topic.subTopics.forEach((subTopic, idx) => {
        subTopic.order = idx;
      });
      res.json({ success: true, message: 'Sub-topic deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Sub-topic not found' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// POST - Add question
app.post('/api/topics/:topicId/subtopics/:subtopicId/questions', (req, res) => {
  const { topicId, subtopicId } = req.params;
  const { title, link, difficulty } = req.body;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    const subTopic = topic.subTopics.find(st => st.id === subtopicId);
    if (subTopic) {
      const newQuestion = {
        id: generateId('q'),
        title,
        link: link || '',
        difficulty: difficulty || 'Medium',
        order: subTopic.questions.length
      };
      subTopic.questions.push(newQuestion);
      res.json({ success: true, data: newQuestion });
    } else {
      res.status(404).json({ success: false, message: 'Sub-topic not found' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// PUT - Update question
app.put('/api/topics/:topicId/subtopics/:subtopicId/questions/:questionId', (req, res) => {
  const { topicId, subtopicId, questionId } = req.params;
  const { title, link, difficulty } = req.body;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    const subTopic = topic.subTopics.find(st => st.id === subtopicId);
    if (subTopic) {
      const question = subTopic.questions.find(q => q.id === questionId);
      if (question) {
        question.title = title || question.title;
        question.link = link !== undefined ? link : question.link;
        question.difficulty = difficulty || question.difficulty;
        res.json({ success: true, data: question });
      } else {
        res.status(404).json({ success: false, message: 'Question not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Sub-topic not found' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// DELETE - Delete question
app.delete('/api/topics/:topicId/subtopics/:subtopicId/questions/:questionId', (req, res) => {
  const { topicId, subtopicId, questionId } = req.params;
  const topic = questionSheet.topics.find(t => t.id === topicId);
  if (topic) {
    const subTopic = topic.subTopics.find(st => st.id === subtopicId);
    if (subTopic) {
      const index = subTopic.questions.findIndex(q => q.id === questionId);
      if (index !== -1) {
        subTopic.questions.splice(index, 1);
        // Reorder remaining questions
        subTopic.questions.forEach((question, idx) => {
          question.order = idx;
        });
        res.json({ success: true, message: 'Question deleted' });
      } else {
        res.status(404).json({ success: false, message: 'Question not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Sub-topic not found' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Topic not found' });
  }
});

// PUT - Reorder elements
app.put('/api/sheet/reorder', (req, res) => {
  const { topics } = req.body;
  questionSheet.topics = topics;
  // Update order indices
  questionSheet.topics.forEach((topic, idx) => {
    topic.order = idx;
    topic.subTopics.forEach((subTopic, subIdx) => {
      subTopic.order = subIdx;
      subTopic.questions.forEach((question, qIdx) => {
        question.order = qIdx;
      });
    });
  });
  res.json({ success: true, data: questionSheet });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
