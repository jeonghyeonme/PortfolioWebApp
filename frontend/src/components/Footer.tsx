import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { Github } from 'lucide-react';
import { Button } from './ui/button';

interface ProfileData {
  email: string | null;
  githubUsername: string | null;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  // Initialize state as null, with no fallback data
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.get();
        // Set state only with data from the API
        if (data && data.social_links) {
          setProfileData({
            email: data.social_links.email,
            githubUsername: data.social_links.github,
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile for footer:', err);
        // Do not set fallback data on error
      }
    };

    fetchProfile();
  }, []);

  // Construct the full GitHub URL only if the username exists
  const githubUrl = profileData?.githubUsername 
    ? `https://github.com/${profileData.githubUsername}` 
    : '#';

  return (
    <footer className="bg-muted/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Left Side: Info */}
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          <p>&copy; {currentYear} DEV.PORTFOLIO. All Rights Reserved.</p>
          {/* Only render email if it exists in the fetched data */}
          {profileData?.email && (
            <a 
              href={`mailto:${profileData.email}`} 
              className="hover:text-primary transition-colors"
            >
              {profileData.email}
            </a>
          )}
        </div>
        
        {/* Right Side: Social Icon */}
        {/* Only render GitHub icon if it exists in the fetched data */}
        {profileData?.githubUsername && (
          <div className="flex items-center">
            <Button 
              asChild
              size="icon" 
              variant="ghost"
            >
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <Github className="w-5 h-5" />
              </a>
            </Button>
          </div>
        )}

      </div>
    </footer>
  );
}