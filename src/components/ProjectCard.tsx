import { Clock5Icon, HomeIcon, PackageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeleteProjectDialog from './projects/DeleteProjectDialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export interface ProjectCardProps {
  slug: string;
  projectName: string;
  projectDesc: string;
  projectData: number;
  updatedAt: string;
  setProjects?: React.Dispatch<React.SetStateAction<Array<object>>>;
}

export default function MyProjectCard(props: ProjectCardProps) {
  function LastUpatedAtFormatter(date: string): string {
    const now = new Date();
    const updatedAt = new Date(date);
    const diff = now.getTime() - updatedAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);
    if (days > 0) {
      return days + ' days ago';
    } else if (hours > 0) {
      return hours + ' hours ago';
    } else if (minutes > 0) {
      return minutes + ' minutes ago';
    } else {
      return seconds + ' seconds ago';
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row gap-4">
        <div className="flex gap-1 items-center">
          <HomeIcon className="w-8 h-8" />
          <Link to={`/project/${props.slug}`}>
            <div className="grid gap-1">
              <CardTitle>{props.projectName}</CardTitle>
            </div>
          </Link>
        </div>
        <DeleteProjectDialog projectSlug={props.slug} setProjects={props.setProjects} />
      </CardHeader>
      <CardContent>
        <CardDescription>{props.projectDesc}</CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock5Icon className="w-4 h-4" />
            <span className="text-gray-500 dark:text-gray-400">{LastUpatedAtFormatter(props.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <PackageIcon className="w-4 h-4" />
            <span className="text-gray-500 dark:text-gray-400">{props.projectData}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
