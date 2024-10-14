import React from 'react';
import { Save, Github, Upload } from 'lucide-react';

interface DeploymentOptionsProps {
  onSaveLocally: () => void;
  onGithubUpload: () => void;
  onVercelDeploy: () => void;
  isDeploying: boolean;
}

const DeploymentOptions: React.FC<DeploymentOptionsProps> = ({
  onSaveLocally,
  onGithubUpload,
  onVercelDeploy,
  isDeploying,
}) => {
  return (
    <div className="flex justify-between mt-4">
      <button onClick={onSaveLocally} className="btn btn-secondary">
        <Save className="mr-2" /> Save Locally
      </button>
      <button onClick={onGithubUpload} className="btn btn-secondary">
        <Github className="mr-2" /> Upload to GitHub
      </button>
      <button onClick={onVercelDeploy} className="btn btn-secondary" disabled={isDeploying}>
        <Upload className="mr-2" /> {isDeploying ? 'Deploying...' : 'Deploy to Vercel'}
      </button>
    </div>
  );
};

export default DeploymentOptions;