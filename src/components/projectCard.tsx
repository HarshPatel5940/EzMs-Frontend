import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

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
    <Card>
      <CardHeader className="text-xl font-bold">{props.projectName}</CardHeader>
      <CardContent className="text-l font-semibold text-gray-800">
        Slug: {props.slug}
        <br />
        Description:{props.projectDesc}
        <br />
        Data Count: {props.projectData}
      </CardContent>
      <CardFooter className="text-sm text-">Last Updated: {LastUpatedAtFormatter(props.updatedAt)}</CardFooter>
    </Card>
  );
}
