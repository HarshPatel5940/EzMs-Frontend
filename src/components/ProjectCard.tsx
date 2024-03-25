import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { HomeIcon, MoreHorizontalIcon, Clock5Icon, PackageIcon } from 'lucide-react';
import { Button } from './ui/button';
import server from '@/lib/utils';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export interface ProjectCardProps {
  slug: string;
  projectName: string;
  projectDesc: string;
  projectData: number;
  updatedAt: string;
  setProjects?: React.Dispatch<React.SetStateAction<Array<object>>>;
}

export default function MyProjectCard(props: ProjectCardProps) {
  const [token] = useState<string | null>(parseCookies().userToken || null);

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

  const deleteProject = async () => {
    try {
      const res = await server.delete(`/api/project/${props.slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props.setProjects?.(prev => prev.filter((project: any) => project.slug !== props.slug));
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.warning('Please Re-Login to Continue');
          return;
        }
        if (error.response?.status === 401) {
          toast.warning('Please Re-Login. Token Expired!');
          return;
        }
      }
      toast.error('Unexpected Error Occured');
      toast.info('Please Try Again Later or Try after Relogin');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <HomeIcon className="w-8 h-8" />
        <Link to={`/project/${props.slug}`}>
          <div className="grid gap-1">
            <CardTitle>{props.projectName}</CardTitle>
            <CardDescription>{props.projectDesc}</CardDescription>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" size="icon" variant="ghost">
              <MoreHorizontalIcon className="w-4 h-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to={`/project/${props.slug}`}>
              <DropdownMenuItem>View Project</DropdownMenuItem>
            </Link>
            {/* // TODO: impement edit project */}
            <DropdownMenuItem>Edit Project</DropdownMenuItem>
            <DropdownMenuItem onSelect={deleteProject}>Delete Project</DropdownMenuItem>
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
  );
}
