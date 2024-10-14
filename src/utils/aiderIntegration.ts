import { spawn } from 'child_process';

export const runAiderCommand = async (prompt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const aiderProcess = spawn('aider', ['--no-git'], { shell: true });
    
    let output = '';
    let errorOutput = '';

    aiderProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    aiderProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    aiderProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Aider process exited with code ${code}. Error: ${errorOutput}`));
      }
    });

    aiderProcess.stdin.write(prompt);
    aiderProcess.stdin.end();
  });
};