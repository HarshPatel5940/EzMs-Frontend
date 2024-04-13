import { LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export interface ProjectData {
  id: string;
  projectId: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyProjectDataCard(props: ProjectData) {
  function DateFormatter(date: string): string {
    const d = new Date(date);
    return d.toLocaleTimeString() + ' ' + d.toLocaleDateString();
  }

  return (
    <Card>
      <CardHeader>
        <img src={props.imageUrl} alt="project" className="w-full h-64 object-cover" />
      </CardHeader>
      <CardContent className="space-y-1">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description ? props.description : 'No Descrpition Provided'}</CardDescription>
        <div className="flex  align-middle">
          <LinkIcon size={21} className="pt-1" />
          <a className="text-blue-500" href={props.url}>
            {props.url}
          </a>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between">
          <div className="flex-col">
            <div>Created At: {DateFormatter(props.createdAt)}</div>
            <div>Updated At: {DateFormatter(props.updatedAt)}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
