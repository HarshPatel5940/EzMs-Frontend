import MyNavbar from '@/components/Navbar';
import SideBar from '@/components/SideBar';
import AddImageDialog from '@/components/projectData/AddImageDialog';
import ProjectDataCard, { type ProjectData } from '@/components/projectDataCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export interface Project {
  slug: string;
  projectName: string;
  projectDesc: string;
  projectToken: string;
  projectData: ProjectData[];
  users: Array<{ email: string }>;
  createdAt: string;
  updatedAt: string;
}

export default function ManageProjectDataPage() {
  const navigate = useNavigate();
  const [token] = useState<string | null>(parseCookies().userToken || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [debouncedProjectData, setDebouncedProjectData] = useState<ProjectData[]>([]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const projectId = useParams().projectId;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.warning('Please Login to Continue');
      return;
    }
    fetchProjectData();
  }, [token, navigate]);

  useEffect(() => {
    if (!project) return;

    setProjectData(project.projectData);
  }, [project]);

  useEffect(() => {
    if (!debouncedSearch) {
      setDebouncedProjectData(projectData);
    }

    const filterdProjectData = projectData.filter(
      projectData =>
        projectData.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        projectData.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        projectData.url?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        projectData.imageUrl.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        projectData.id.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

    setDebouncedProjectData(filterdProjectData);
  }, [projectData, debouncedSearch]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = search;
    }
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  function handleSearch() {
    setSearch(inputRef.current?.value || '');
  }

  const fetchProjectData = async () => {
    try {
      const res = await server.get(`/api/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        console.error('Unexpected Response from Server', res.status);
        toast.error('Unexpected Response from Server');
        return;
      }

      const data = res.data;
      setIsVerified(true);
      setProject(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          destroyCookie(null, 'userToken');
          toast.warning('Token Expired. Logging Out!');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }
        if (error.response?.status === 401) {
          toast.warning('Please Re-Login. Token Expired!');
          return;
        }
        if (error.response?.status === 403) {
          toast.warning('Contact Admin! Unverified!', {
            description: 'Your account is not verified yet',
          });

          return;
        }
        const err = error.response?.data.message || 'Something went wrong';
        toast.error(err);
        return;
      }

      console.error('Unexpected Response from Server', error);
    }
  };

  function displayDataTable(): React.ReactNode {
    return (
      <div className="flex flex-col items-center w-full">
        {debouncedProjectData.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-6xl w-full mx-auto">
            {debouncedProjectData.map((project: ProjectData) => {
              return (
                <ProjectDataCard
                  id={project.id}
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  url={project.url}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                  projectId={project.projectId}
                  setProjectData={setProjectData}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-4xl opacity-50">
              {debouncedSearch ? `No Project Data with ${debouncedSearch} Found` : 'No Project Data Added Yet!'}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <MyNavbar projectName={project?.projectName} />
      <div className="flex flex-row w-full">
        <SideBar baseUrl={`/project/${project?.slug}`} />
        {isVerified && (
          <main className="flex min-h-screen bg-gray-200/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
            <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
              <Input
                className="shadow-md bg-white dark:bg-gray-950"
                onChange={handleSearch}
                ref={inputRef}
                placeholder="Search Inside Your Project..."
              />
              <Button className="sr-only" type="submit">
                Submit
              </Button>
              <AddImageDialog projectSlug={projectId || ''} setProjectData={setProjectData} />
            </div>
            {displayDataTable()}
          </main>
        )}
      </div>
      <footer className="p-5 text-center bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">© 2023 by HarshPatel5940. All rights reserved.</p>
      </footer>
    </div>
  );
}
