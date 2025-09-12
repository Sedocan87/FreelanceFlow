import React from 'react';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useProjectStore from '@/store/projectStore';
import { Progress } from '@/components/ui/progress';

interface ProjectSummary {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface ProjectStatusProps {
  className?: string;
}

const ProjectStatus = ({ className }: ProjectStatusProps) => {
  const { projects } = useProjectStore();

  const summary = React.useMemo<ProjectSummary>(() => {
    const result = {
      total: projects.length,
      completed: 0,
      inProgress: 0,
      notStarted: 0
    };

    projects.forEach(project => {
      if (!project.tasks.length) {
        result.notStarted++;
      } else {
        const completedTasks = project.tasks.filter(task => task.completed).length;
        const progress = (completedTasks / project.tasks.length) * 100;

        if (progress === 100) {
          result.completed++;
        } else if (progress > 0) {
          result.inProgress++;
        } else {
          result.notStarted++;
        }
      }
    });

    return result;
  }, [projects]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Project Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{summary.inProgress}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Not Started</span>
            <span>{((summary.notStarted / summary.total) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(summary.notStarted / summary.total) * 100} className="bg-gray-200" />

          <div className="flex justify-between text-sm">
            <span>In Progress</span>
            <span>{((summary.inProgress / summary.total) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(summary.inProgress / summary.total) * 100} className="bg-blue-200" />

          <div className="flex justify-between text-sm">
            <span>Completed</span>
            <span>{((summary.completed / summary.total) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(summary.completed / summary.total) * 100} className="bg-green-200" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;
