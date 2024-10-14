import React, { useState } from 'react';
import { MessageSquare, Play, Save, Github, Upload } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import DeploymentOptions from './components/DeploymentOptions';
import { runAiderCommand } from './utils/aiderIntegration';
import { generateProjectCode, generateProjectName, generatePreview, saveProjectLocally, uploadToGithub, deployToVercel } from './utils/projectGenerator';
import { Octokit } from 'octokit';
import { VercelClient } from '@vercel/client';

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [code, setCode] = useState('');
  const [projectName, setProjectName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleChatSubmit = async (message) => {
    setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
    
    try {
      const aiderResponse = await runAiderCommand(message);
      setChatMessages([...chatMessages, { text: message, sender: 'user' }, { text: aiderResponse, sender: 'bot' }]);
      
      const generatedCode = await generateProjectCode(aiderResponse);
      setCode(generatedCode);
      setProjectName(generateProjectName(message));
    } catch (error) {
      console.error('Error running Aider command:', error);
      setChatMessages([...chatMessages, { text: message, sender: 'user' }, { text: 'Error: Unable to process your request.', sender: 'bot' }]);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handlePreview = () => {
    const previewUrl = generatePreview(code);
    setPreviewUrl(previewUrl);
  };

  const handleSaveLocally = () => {
    saveProjectLocally(projectName, code);
  };

  const handleGithubUpload = async () => {
    const octokit = new Octokit({ auth: 'YOUR_GITHUB_TOKEN' });
    await uploadToGithub(octokit, projectName, code);
  };

  const handleVercelDeploy = async () => {
    setIsDeploying(true);
    const vercel = new VercelClient({ token: 'YOUR_VERCEL_TOKEN' });
    const deployUrl = await deployToVercel(vercel, projectName, code);
    setIsDeploying(false);
    if (deployUrl) {
      setPreviewUrl(deployUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Interactive Project Generator</h1>
      </header>
      <main className="flex-grow flex">
        <div className="w-1/3 p-4 border-r">
          <ChatInterface messages={chatMessages} onSubmit={handleChatSubmit} />
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <CodeEditor code={code} onChange={handleCodeChange} />
          <div className="mt-4 flex justify-between">
            <button onClick={handlePreview} className="btn btn-primary">
              <Play className="mr-2" /> Preview
            </button>
            <DeploymentOptions
              onSaveLocally={handleSaveLocally}
              onGithubUpload={handleGithubUpload}
              onVercelDeploy={handleVercelDeploy}
              isDeploying={isDeploying}
            />
          </div>
          {previewUrl && <Preview url={previewUrl} />}
        </div>
      </main>
    </div>
  );
}

export default App;