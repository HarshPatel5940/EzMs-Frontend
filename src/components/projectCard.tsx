import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { HomeIcon, MoreHorizontalIcon, Clock5Icon, PackageIcon } from 'lucide-react';
import { Button } from './ui/button';

export interface ProjectCardProps {
  slug: string;
  projectName: string;
  projectDesc: string;
  projectData: number;
  updatedAt: string;
}

export default function ProjectCard(props: ProjectCardProps) {
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
    <Link to={`/project/${props.slug}`}>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <HomeIcon className="w-8 h-8" />
          <div className="grid gap-1">
            <CardTitle>{props.projectName}</CardTitle>
            <CardDescription>{props.projectDesc}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto" size="icon" variant="ghost">
                <MoreHorizontalIcon className="w-4 h-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* // todo: redirect to respective project stuff */}
              <DropdownMenuItem>View Project</DropdownMenuItem>
              <DropdownMenuItem>View Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="grid gap-2">
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
        </CardContent>
      </Card>
    </Link>
  );
}
