import Navbar from '@/components/navbar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import server from '@/lib/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { destroyCookie, parseCookies } from 'nookies';
import ProjectCard from '@/components/projectCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projectCards, setProjectCards] = useState<React.ReactNode[]>([]);
  const [projects, setProjects] = useState<Array<object>>([]);
  const [token] = useState<string | null>(parseCookies().userToken || null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.warning('Please Login to Continue');
      return;
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    handleProjects();
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const res = await server.get('/api/project/', {
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
      setProjects(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          destroyCookie(null, 'userToken');
          navigate('/login');
          toast.warning('Please Login to Continue');
          return;
        }
        if (error.response?.status === 401) {
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

  function handleProjects() {
    let projectCards: React.ReactNode[] = [];

    projectCards = projects.map((project: any) => {
      return (
        <ProjectCard
          key={project.slug}
          slug={project.slug}
          projectName={project.projectName}
          projectDesc={project.projectDesc}
          projectData={project.projectData.length}
          updatedAt={project.updatedAt}
        />
      );
    });
    setProjectCards(projectCards);
  }

  function displayProjectCards(): React.ReactNode {
    return (
      <>
        {projectCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5">{projectCards}</div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-4xl opacity-50">No Projects Created Yet!</div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar text="Your Projects" />
      <section className="flex flex-col items-center h-screen bg-gray-100 dark:bg-gray-900" id="hero">
        <h1 className="text-3xl font-bold text-center pt-3">Projects</h1>
        {displayProjectCards()}
      </section>

      <footer className="p-5 text-center bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">© 2023 by HarshPatel5940. All rights reserved.</p>
      </footer>
    </div>
  );
}
