import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useProjectStore from '@/store/projectStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProjectDistributionChart = () => {
  const { projects } = useProjectStore();

  const data = useMemo(() => {
    return projects.map(project => ({
      name: project.name,
      value: project.tasks.reduce((sum, task) => sum + task.hours, 0),
    })).filter(item => item.value > 0);
  }, [projects]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} hours`, 'Time Spent']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectDistributionChart;
