import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import useThemeStore from '../store/useThemeStore';

// Theme-aware colours for charts (work in both light and dark)
const getChartColors = (isDark) => ({
  text: isDark ? '#e5e7eb' : '#374151',
  grid: isDark ? '#374151' : '#e5e7eb',
  tooltipBg: isDark ? '#1f2937' : '#ffffff',
  tooltipBorder: isDark ? '#374151' : '#e5e7eb',
  barFill: isDark ? '#0ea5e9' : '#0284c7',
  barStroke: isDark ? '#38bdf8' : '#0369a1',
  pieColors: isDark
    ? ['#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4']
    : ['#16a34a', '#ca8a04', '#dc2626', '#7c3aed', '#0891b2'],
});

const ChartsSection = ({ sheet }) => {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = useMemo(() => getChartColors(isDark), [isDark]);

  const questionsByTopic = useMemo(() => {
    if (!sheet?.topics) return [];
    return sheet.topics.map((topic) => {
      const count = topic.subTopics?.reduce(
        (acc, st) => acc + (st.questions?.length ?? 0),
        0
      );
      return { name: topic.title, questions: count, total: count };
    });
  }, [sheet]);

  const difficultyData = useMemo(() => {
    if (!sheet?.topics) return [];
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    sheet.topics.forEach((topic) => {
      topic.subTopics?.forEach((st) => {
        st.questions?.forEach((q) => {
          const d = q.difficulty || 'Medium';
          if (counts[d] !== undefined) counts[d]++;
          else counts.Medium++;
        });
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sheet]);

  if (!sheet?.topics?.length) return null;

  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Questions per Topic
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={questionsByTopic} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="name"
              tick={{ fill: colors.text, fontSize: 12 }}
              stroke={colors.grid}
            />
            <YAxis
              tick={{ fill: colors.text, fontSize: 12 }}
              stroke={colors.grid}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: '8px',
                color: colors.text,
              }}
              labelStyle={{ color: colors.text }}
            />
            <Bar
              dataKey="questions"
              fill={colors.barFill}
              stroke={colors.barStroke}
              radius={[4, 4, 0, 0]}
              name="Questions"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Difficulty Distribution
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={difficultyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={{ stroke: colors.grid }}
            >
              {difficultyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: '8px',
                color: colors.text,
              }}
              formatter={(value) => [value, 'Questions']}
            />
            <Legend
              wrapperStyle={{ color: colors.text }}
              formatter={(value) => <span style={{ color: colors.text }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
